'use strict';

const express = require('express');
const config = require('config');

const { MessageReceived, PostbackReceived } = require('../messenger/callbacks');
const User = require('../models/User');
const Batch = require('../messenger/Batch');
const { Oracle } = require('../oracle');

const oracle = new Oracle();

var router = express.Router();

router.get('/', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === config.get('validationToken')) {

    console.log("Validating webhook");

    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");

    res.sendStatus(403);
  }
});

router.post('/', (req, res) => {
  const data = req.body;

  let batch = new Batch(data.object, data.entry[0]);

  batch._events.forEach(event => {
    if (event.comesFromPage()) {
      const userId = event.getSenderId();

      User.findOrCreateFbUser(userId, (err, user) => {
        if (!err) {
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
        }
      });
    }
  });

  res.sendStatus(200);
});

router.post('/oracle/predict', (req, res) => {
  const { text, clientId } = req.body;

  User.findOrCreateFbUser(clientId, (err, user) => {
    if (!err) {
      oracle.think(user);
      oracle.predict(user, text);
    }
  });

  res.sendStatus(200);
});

module.exports = router;
