'use strict';

const express = require('express');

const policyRouter = () => {
  const router = express.Router();

  router.get('/fb', (req, res) => {
    res.render('fb-policy');
  });

  return router;
}

module.exports = policyRouter;
