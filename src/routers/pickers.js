'use strict';

const express = require('express');
const router = express.Router();

router.get('/time', (req, res) => {
  res.render('time-picker');
});

router.get('/day', (req, res) => {
  res.render('day-picker');
});

module.exports = router;