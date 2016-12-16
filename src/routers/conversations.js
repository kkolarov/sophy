'use strict';

const express = require('express');

const User = require('../models/User');

function conversationsRouter(conversationManager) {
  const router = express.Router();

  router.param('fbUser', (req, res, next, id) => {
    User.findUserByRecipientId(id)
      .then(user => {
        req.user = user;

        next();
      })
      .catch(err => {
        req.user = null;

        next();
      });
  });

  router.get('/:fbUser', (req, res) => {
    if (req.user) {
      const conversation = conversationManager.findOrCreateConversation(req.user);

      res.json(conversation.context);
    } else {
      res.json({});
    }
  });

  return router;
}

module.exports = conversationsRouter;
