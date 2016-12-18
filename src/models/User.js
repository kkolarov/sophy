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
  return new Promise((resolve, reject) => {
    User.findOne({ recipientId: recipientId }, (err, user) => {
      if (!err) {
        resolve(user);
      } else {
        reject(err);
      }
    });
  });
}

const User = mongoose.model('User', userSchema);

module.exports = User;
