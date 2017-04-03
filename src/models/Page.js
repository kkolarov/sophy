'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  pageId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  _business: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  }
});

pageSchema.statics.findPageById = (id) => {
  return Page.findOne({ pageId: id });
}

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
