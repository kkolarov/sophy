'use strict';

const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FB = require('fb');

FB.options({ version: config.get('fbVersion'), appSecret: config.get('appSecret') });
FB.setAccessToken(config.get('pageAccessToken'));

const userSchema = new Schema({
  fbUserId: {
    type: Number
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

userSchema.statics.findOrCreateFbUser = (fbUserId, cb) => {
  User.findOne({ fbUserId: fbUserId }, (err, user) => {
    if (!err) {
      if (!user) {
        FB.api(`${fbUserId}`, 'get', { }, function (res) {
          if (!res.error) {
            const user = new User({
              fbUserId: fbUserId,
              firstName: res.first_name || '',
              lastName: res.last_name || '',
              pictureUrl: res.profile_pic || '',
              locale: res.locale || '',
              timezone: res.timezone || '',
              gender: res.gender || ''
            });

            user.save((err, user) => {
              cb(err, user);
            });
          } else {
            cb(res.error, null);
          }
        });
      } else {
        cb(null, user);
      }
    } else {
      cb(err, null);
    }
  });
}

const User = mongoose.model('User', userSchema);

module.exports = User;
