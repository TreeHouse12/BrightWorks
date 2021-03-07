const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({

  imagePath: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  jobTitle:{
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  }
});



module.exports = mongoose.model('Service', schema);
