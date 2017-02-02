'use strict';

const express = require('express');

const pickersRouter = () => {
  const router = express.Router();

  router.get('/time', (req, res) => {
    res.render('time-picker');
  });

  router.get('/day', (req, res) => {
    res.render('day-picker');
  });

  router.get('/support', (req, res) => {
    res.render('messenger-webview-support');
  });

  return router;
}

module.exports = pickersRouter;
