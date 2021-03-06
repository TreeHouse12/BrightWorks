const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cart: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    integer: true
  },
  name: {
    type: String,
    required: true
  },
  paymentId :{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Order', schema);
