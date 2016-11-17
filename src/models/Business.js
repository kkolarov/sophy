'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  subscribe: {
    type: String,
    enum: ['booking'],
    required: true
  }
}, {
  collection: 'businesses'
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
