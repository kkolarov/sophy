'use strict';

const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  recipientId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  locale: {
    type: String,
    required: true
  },
  timezone: {
    type: Number,
    required: true
  },
  pictureUrl: {
    type: String,
  },
  _page: {
    type: Schema.Types.ObjectId,
    ref: 'Page'
  }
});

userSchema.statics.findUserByRecipientId = (recipientId) => {
  return User.findOne({ recipientId: recipientId });
}

userSchema.statics.findUsers = () => {
  return User.find().populate('_page').exec();
}

const User = mongoose.model('User', userSchema);

module.exports = User;
