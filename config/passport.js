const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    req.checkBody('username', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Your password must be at least 5 characters').notEmpty().isLength({min:5});
    var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      errors.forEach(function(error) {
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username': username}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'Email already in use.'});
        }
        var newUser = new User();
        newUser.username = username;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
          if (err) {
              return done(err);
          }
          return done(null, newUser);
        });
    });
}));
