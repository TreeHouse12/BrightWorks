const express = require('express');
const router = express.Router();
const Service = require('../models/service');
const Cart = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');
require('dotenv/config');

//GET HOME PAGE
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Service.find(function(err, docs) {
    var serviceChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      serviceChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', services: serviceChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-chart/:id', function(req, res, next) {
  var serviceId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Service.findById(serviceId, function(err, service) {
    if (err) {
        return res.redirect('/');
    }
    cart.add(service,  service.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var serviceId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(serviceId);
  req.session.cart = cart;
  res.redirect('/shopping-cart')
});

router.get('/remove/:id', function(req, res, next) {
  var serviceId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(serviceId);
  req.session.cart = cart;
  res.redirect('/shopping-cart')
});

router.get('/reviews', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('about/reviews', {services: null});
  }
});

router.get('/why_us', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('about/why_us', {services: null});
  }
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {services: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {services: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, async (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  //var token = req.body.stripeToken;
  //console.log(token)
  const stripe = require('stripe')(process.env.SECRET_KEY);
  if (req.body.payment_method_id) {
    const customer = await stripe.customers.create({
      email: req.user.username,
      //source: token
      payment_method: req.body.payment_method_id,
      invoice_settings: {
        default_payment_method: req.body.payment_method_id,
      }
    })
    console.log(customer.id);
    //if (paymentMethodId) {
    await stripe.paymentIntents.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      payment_method: req.body.payment_method_id,
      receipt_email: req.user.username,
      confirmation_method: 'manual',
      customer: customer.id,
      confirm: true,
      payment_method_types: ['card'],
      description: "Test Charge"
    },
    async function(err, charge) {
      console.log(charge);
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
      });
      order.save(function(err,result) {
        console.log("Success");
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        return res.redirect('/');
      });
    })
  } else if (req.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
      req.body.payment_intent_id
    );
  }
    // Send the response to the client
    // console.log(charge);
    //res.send(generateResponse(charge));
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true
    };
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status'
    }
  }
};
