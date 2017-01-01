'use strict';

const fbRouter = require('./fb');
const pickersRouter = require('./pickers');
const predictionsRouter = require('./predictions');
const conversationsRouter = require('./conversations');
const suggestionsRouter = require('./suggestions');

function Routers(oracle, conversationManager) {
  return {
      fbRouter: fbRouter,
      pickersRouter: pickersRouter,
      conversationsRouter: conversationsRouter(conversationManager),
      predictionsRouter: predictionsRouter(oracle, conversationManager),
      suggestionsRouter: suggestionsRouter
  }
}

module.exports = Routers;
