'use strict';

const express = require('express');
const config = require('config');

const { MessageReceived, PostbackReceived } = require('../messenger/callbacks');
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
      const clientId = event.getSenderId();

      if (event instanceof MessageReceived && !event.isEcho()) {
        const text = event.getText();

        oracle.think(clientId);
        oracle.predict(clientId, text);
      } else if (event instanceof PostbackReceived) {
        const payload = event.getPayload();

        // A Messener bug about typing bubble
        setTimeout(() => {
          oracle.think(clientId);
          oracle.predict(clientId, payload);
        }, 1000);
      }
    }
  });

  res.sendStatus(200);
});

router.post('/oracle/predict', (req, res) => {
  const { text, clientId } = req.body;

  console.log(req.body);

  oracle.think(clientId);
  oracle.predict(clientId, text);

  res.sendStatus(200);
});

module.exports = router;
