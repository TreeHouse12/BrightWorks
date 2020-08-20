const express = require('express');
const router = express.Router();
const Service = require('../models/service');
const csrf = require('csurf');

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
  res.render('../user/signup', {csrfToken: req.csrfToken()});
});

module.exports = router;
