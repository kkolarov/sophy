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
    required: true,
    enum: ['dentistry']
  },
  fbPage: {
    id: {
      type: Number
    },
    accessToken: {
      type: String
    },
    validationToken: {
      type: String
    },
    fbAppSecret: {
      type: String
    }
  }
}, {
  collection: 'businesses'
});

businessSchema.statics.findBusinessByPageId = (pageId) => {
  return new Promise((resolve, reject) => {
    Business.findOne({
      'fbPage.id': pageId
    }, (err, business) => {
      resolve(business);
    });
  });
}

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
