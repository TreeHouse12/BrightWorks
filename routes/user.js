const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const async = require('async');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const User = require('../models/user');
require('dotenv/config');

const Order = require('../models/order')
const Cart = require('../models/cart')

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
  Order.find({user: req.user}, function(err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders});
  });
});

router.get('/contact', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/contact',  {csrfToken: req.csrfToken(), messages :messages, hasErrors: messages.length > 0});
});

router.post('/send', function (req, res, next) {
  const output = `
  <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'mail.brightworksmaintenance.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD  // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"Contact" <>', // sender address
    to: 'support@brightworksmaintenance.com', // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('user/contact', {msg:'Email has been sent'});
});
});

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

router.get('/forgot', function (req, res) {
  var messages = req.flash('error');
  var successMsg = req.flash('success')[0];
  res.render('user/forgot', {csrfToken: req.csrfToken(), messages: messages, successMsg: successMsg, hasErrors: messages.length > 0});
});

router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.email }, function(err, user) {
        console.log(user);
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/user/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'mail.brightworksmaintenance.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      var mailOptions = {
        to: user.username,
        from: 'support@brightworksmaintenance.com',
        subject: 'Password Reset Request',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/user/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/user/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages :messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
   if (req.session.oldUrl) {
     var oldUrl = req.session.oldUrl;
     req.session.oldUrl = null;
     res.redirect(oldUrl);
   } else {
     res.redirect('/user/profile')
   }
});

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages :messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
   if (req.session.oldUrl) {
     var oldUrl = req.session.oldUrl;
     req.session.oldUrl = null;
     res.redirect(oldUrl);
   } else {
     res.redirect('/user/profile')
   }
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
