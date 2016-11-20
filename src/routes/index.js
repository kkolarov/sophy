'use strict';

const apiRoute = require('./api');
const pickerRoute = require('./picker');
const testRoute = require('./test');

module.exports = {
  apiRoute: apiRoute,
  testRoute: testRoute,
  pickerRoute: pickerRoute
};
