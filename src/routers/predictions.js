'use strict';

const express = require('express');

const User = require('../models/User');

function predictionsRouter(oracle) {

  const router = express.Router();

  router.param('fbUser', (req, res, next, id) => {
    User.findUserByRecipientId(id)
      .then(user => {
        req.user = user;

        next();
      }).catch(err => {
        req.user = null;

        next();
      });
  });

  router.post('/:fbUser', (req, res) => {
    const text = req.body.text;

    if (req.xhr && req.user) {
      oracle.think(req.user);
      oracle.predict(req.user, text);
    }

    res.sendStatus(200);
  });

  return router;
}

module.exports = predictionsRouter;
