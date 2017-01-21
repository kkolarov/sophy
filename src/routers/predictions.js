'use strict'

const express = require('express');

const User = require('../models/User');

function predictionsRouter(oracle, conversationManager) {
  const router = express.Router();

  router.post('/:userId', (req, res) => {
    const text = req.body.text;

    if (req.xhr) {
      const userId = req.params.userId;

      conversationManager.findConversationByUserId(userId)
        .then(conversation => {
          oracle.think(userId, conversation);
          oracle.predict(userId, text, conversation)
            .catch(err => {
              console.log(err);
            });
        });
    }

    res.sendStatus(200);
  });

  return router;
}

module.exports = predictionsRouter;
