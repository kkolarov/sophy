'use strict';

const fbRouter = require('./fb');
const pickersRouter = require('./pickers');
const predictionsRouter = require('./predictions');
const conversationsRouter = require('./conversations');

function Routers(oracle, conversationManager) {

  return {
      fbRouter: fbRouter(oracle, conversationManager),
      pickersRouter: pickersRouter,
      conversationsRouter: conversationsRouter(conversationManager),
      predictionsRouter: predictionsRouter(oracle)
  }
}

module.exports = Routers;
