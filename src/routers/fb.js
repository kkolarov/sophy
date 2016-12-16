'use strict';

const express = require('express');
const config = require('config');

const FB = require('fb');

const { MessageReceived, PostbackReceived } = require('@fanatic/messenger').callbacks;
const Batch = require('@fanatic/messenger').Batch;

const User = require('../models/User');

FB.options({
  version: config.services.facebook.version,
  appSecret: config.services.facebook.appSecret
});

FB.setAccessToken(config.services.facebook.pageAccessToken);

function fbRouter(oracle, conversationManager) {

  const router = express.Router();

  router.get('/', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === config.services.facebook.pageValidationToken) {

      console.log("Validating webhook");

      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");

      res.sendStatus(403);
    }
  });

  router.post('/', (req, res) => {
    const data = req.body;

    const batch = new Batch(data.object, data.entry[0]);

    batch._events.forEach(event => {
      if (event.comesFromPage()) {
        const userId = event.getSenderId();

        User.findUserByRecipientId(userId)
          .then(user => {
            if (!user) {
              return new Promise((resolve, reject) => {
                FB.api(`${userId}`, 'get', { }, function (fbUser) {
                  if (!fbUser.error) {
                    const user = new User({
                      recipientId: userId,
                      source: 'messenger',
                      firstName: fbUser.first_name,
                      lastName: fbUser.last_name,
                      pictureUrl: fbUser.profile_pic,
                      locale: fbUser.locale,
                      timezone: fbUser.timezone,
                      gender: fbUser.gender
                    });

                    user.save((err, user) => {
                      resolve(user);
                    });
                  } else {
                    reject(fbUser.error);
                  }
                });
              });
            }

            return new Promise((resolve, reject) => {
              resolve(user);
            });
          })
          .then(user => {
            if (event instanceof MessageReceived && !event.isEcho()) {
              const text = event.getText();

              oracle.think(user);
              oracle.predict(user, text);
            } else if (event instanceof PostbackReceived) {
              const payload = event.getPayload();

              // A Messener bug about typing bubble
              setTimeout(() => {
                oracle.think(user);
                oracle.predict(user, payload);
              }, 1000);
            }
          })
          .catch(err => {
            console.log(err);
          });

      }
    });

    res.sendStatus(200);
  });

  return router;
}

module.exports = fbRouter;
