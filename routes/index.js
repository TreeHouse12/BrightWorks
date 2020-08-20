const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const Service = require('../models/service');

var csrfProtection = csrf();
router.use(csrfProtection);

//GET HOME PAGE
router.get('/pricing', function (req, res, next) {
  Service.find(function(err, docs) {
    var serviceChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      serviceChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/pricing', { title: 'Shopping Cart', services: serviceChunks });
  });
});

router.get('/user/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('../user/signup', {csrfToken: req.csrfToken(), messages :messages, hasErrors: messages.length > 0});
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', function (req, res, next) {
  res.render('../user/profile');
});

module.exports = router;
