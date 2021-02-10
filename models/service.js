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

  price: {
    type: Number,
    required: true
  }
  ,

  jobTitle: {
    type: String,
    required: false
  }

 });




module.exports = mongoose.model('Services', schema);
