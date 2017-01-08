'use strict';

const fbRouter = require('./fb');
const pickersRouter = require('./pickers');
const mapsRouter = require('./maps');
const predictionsRouter = require('./predictions');
const conversationsRouter = require('./conversations');
const suggestionsRouter = require('./suggestions');

function Routers(oracle, conversationManager) {
  return {
      fbRouter: fbRouter,
      pickersRouter: pickersRouter,
      mapsRouter: mapsRouter,
      conversationsRouter: conversationsRouter,
      predictionsRouter: predictionsRouter,
      suggestionsRouter: suggestionsRouter
  }
}

module.exports = Routers;
