'use strict';

const express = require('express');
const config = require('config');

const FB = require('fb');

const { MessageReceived, PostbackReceived } = require('@fanatic/messenger').callbacks;
const Batch = require('@fanatic/messenger').Batch;

const User = require('../models/User');
const Business = require('../models/Business');

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
        const pageId = event.getPageId();
        const userId = event.getSenderId();

        conversationManager.findConversationByUserId(userId)
          .then(conversation => {
            return new Promise((resolve, reject) => {
              if (conversation) {
                resolve(conversation);
              } else {
                User.findUserByRecipientId(userId)
                  .then(user => {
                    Business.findBusinessByPageId(pageId)
                      .then(business => {
                        const context = {
                          recipient: {
                            id: user.recipientId
                          }
                        };

                        const metadata = {
                          user: user,
                          business: business
                        };

                        conversationManager.createConversation(userId, context, metadata)
                          .then(conversation => {
                            resolve(conversation);
                          });
                      });
                  });
              }
            });
          }).
          then(conversation => {
            if (event instanceof MessageReceived && !event.isEcho()) {
              const text = event.getText();

              oracle.think(userId, conversation);
              oracle.predict(userId, text, conversation);
            } else if (event instanceof PostbackReceived) {
              const payload = event.getPayload();

              // A Messener bug about typing bubble
              setTimeout(() => {
                oracle.think(userId, conversation);
                oracle.predict(userId, payload, conversation);
              }, 1000);
            }
          }).
          catch(err => {
            console.log(err);
          });
      }
    });

    res.sendStatus(200);
  });

  return router;
}

module.exports = fbRouter;
