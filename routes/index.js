const express = require('express');
const router = express.Router();
const User = require('../lib/User')

//GET HOME PAGE
router.get('/register', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username, password: password}, function(err, user) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }

    if(!user) {
      return res.status(404).send();
    }

    return res.send(200).sned();
  })
});

router.post('/register', function (req,res) {
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  var newuser = new User();
  newuser.username = username;
  newuser.password = password;
  newuser.firstname = firstname;
  newuser.lastname = lastname;
  newuser.save(function(err, savedUser) {
      if(err) {
        console.log(err);
        return res.status(500).send();
      }

      if(!user) {
        return res.status(404).send();
      }

      return res.status(200).send();
  })
});

//PERSIST USER PASS
router.get('/dashboard', function (req, res) {
  if(!req.session.user) {
    return res.status(401).send();
  }

return res.status(200).send("Welcome to Super Secret Login");
})

module.exports = router;
