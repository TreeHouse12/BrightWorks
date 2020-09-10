const express = require('express');
const router = express.Router();
const Service = require('../models/service');
const Cart = require('../models/cart');
const Order = require('../models/order');
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
    const customer = await stripe.customers.create({
      //source: token,
      name: req.body.name,
      payment_method: "pm_card_visa",//req.body.payment_method_id,
      invoice_settings: {
        default_payment_method: "pm_card_visa",//req.body.payment_method_id,
      }
    })
    console.log(customer);
    //if (paymentMethodId) {
    await stripe.paymentIntents.create(
      {
        amount: cart.totalPrice * 100,
        currency: "usd",
        confirmation_method: 'manual',
        confirm: true,
        payment_method: "pm_card_visa",//req.body.payment_method_id,
        payment_method_types: ['card'],
        //source: token, // obtained with Stripe.js
        customer: customer.id,
        description: "Test Charge"
      },
      async function(err, charge) {
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
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
          });
      });
    //}
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
