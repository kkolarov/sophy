'use strict';

const express = require('express');

const mapsRouter = () => {
  const router = express.Router();

  router.get('/google', (req, res) => {
    res.render('google-maps');
  });

  return router;
}

module.exports = mapsRouter;
