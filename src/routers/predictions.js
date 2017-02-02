'use strict'

const express = require('express');

const User = require('../models/User');

function predictionsRouter(oracle, manager, logger) {
  const router = express.Router();

  router.post('/:userId', (req, res) => {
    const text = req.body.text;

    if (req.xhr) {
      const userId = req.params.userId;

      //TODO: Check if the conversation exists.

      manager.findConversationByUserId(userId)
        .then(conversation => {
          return oracle.think(userId, conversation).then(() => {
            return oracle.predict(userId, text, conversation);
          });
        }).catch(err => {
          if (err instanceof Error) {
            logger.error(err.stack);
          }
        });
    }

    res.sendStatus(200);
  });

  return router;
}

module.exports = predictionsRouter;
