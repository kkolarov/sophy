'use strict';

const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  recipientId: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['fb', 'app'],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    require: true
  },
  locale: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  pictureUrl: {
    type: String,
  }
});

userSchema.virtual('fullName').get(function() {
  return this.firstName + " " + this.lastName;
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
