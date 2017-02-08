'use strict';

const fbRouter = require('./fb');
const pickersRouter = require('./pickers');
const mapsRouter = require('./maps');
const predictionsRouter = require('./predictions');
const conversationsRouter = require('./conversations');
const suggestionsRouter = require('./suggestions');
const policyRouter = require('./policies');

module.exports = {
    fbRouter: fbRouter,
    policyRouter: policyRouter,
    pickersRouter: pickersRouter,
    mapsRouter: mapsRouter,
    conversationsRouter: conversationsRouter,
    predictionsRouter: predictionsRouter,
    suggestionsRouter: suggestionsRouter
};
