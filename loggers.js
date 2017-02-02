'use strict';

const config = require('config');

const winston = require('winston');

winston.loggers.add('prediction', config.loggers.prediction);
winston.loggers.add('reservation', config.loggers.reservation);
winston.loggers.add('conversation', config.loggers.conversation);
winston.loggers.add('app', config.loggers.app);
winston.loggers.add('message', config.loggers.message);
winston.loggers.add('interpretation', config.loggers.interpretation);

const predictionLogger = winston.loggers.get('prediction');
const reservationLogger = winston.loggers.get('reservation');
const conversationLogger = winston.loggers.get('conversation');
const routeLogger = winston.loggers.get('route');
const messageLogger = winston.loggers.get('message');
const interpretationLogger = winston.loggers.get('interpretation');

module.exports = {
  'predictionLogger': predictionLogger,
  'reservationLogger': reservationLogger,
  'conversationLogger': conversationLogger,
  'routeLogger': routeLogger,
  'messageLogger': messageLogger,
  'interpretationLogger': interpretationLogger
}
