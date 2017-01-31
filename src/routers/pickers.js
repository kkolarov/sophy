'use strict';

const express = require('express');

const pickersRouter = () => {
  const router = express.Router();

  router.get('/time', (req, res) => {
    res.render('time-picker');
  });

  router.get('/day', (req, res) => {
    if (req.query.hasOwnProperty('mobile')) {
      res.render('day-picker');
    } else {
      res.render('day-picker-web');
    }
  });

  return router;
}

module.exports = pickersRouter;
