const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema = mongoose.Schema({
  fullname: {
    type: String
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
