'use strict';

const express = require('express');

const User = require('../models/User');

function conversationsRouter(conversationManager) {
  const router = express.Router();

  router.get('/:userId', (req, res) => {
    conversationManager.findConversationByUserId(req.params.userId)
      .then(conversation => {
        if (conversation) {
          res.json(conversation.context);
        } else {
          res.json({});
        }
      });
  });

  return router;
}

module.exports = conversationsRouter;
