const express = require('express');
const router = express.Router();
const Service = require('../models/service');

//GET HOME PAGE
router.get('/', function (req, res, next) {
  Service.find(function(err, docs) {
    var serviceChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      serviceChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/pricing', { title: 'Shopping Cart', services: serviceChunks });
  });
});

router.get('/add-to-chart/:id', function(req, res, next) {
  var ProductId = req.parms.id;
  var cart = new Chart(req.session.cart ? req.session.cart : {});

  Service.findById(serviceId, function(err,service) {
    if (err) {
        return res.redirect('/');
    }
    cart.add(service,  service.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});

module.exports = router;
