'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

const Employee = require('./src/models/Employee');
const Assistant = require('@fanatic/reservation').Assistant;
const Messenger = require('@fanatic/messenger').Messenger;
const GoogleCalendar = require('@fanatic/reservation').calendars.GoogleCalendar;
const ConversationManager = require(config.paths.ConversationManager);
const { Oracle, ProphecyInterpreter } = require('@fanatic/oracle');

const {
  predictionLogger,
  reservationLogger,
  conversationLogger,
  routeLogger,
  messageLogger,
  interpretationLogger
} = require('./loggers');

const app = express();

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const calendar = new GoogleCalendar(
  config.services.google.appId,
  config.services.google.appSecret,
  config.services.google.appAuthUri
);

calendar.setToken(config.services.google.users.sophy);

const conversationManager = new ConversationManager(conversationLogger);
const assistant = new Assistant(Employee, calendar, reservationLogger, {
  dateFormat: config.reservation.dateFormat,
  dayFormat: config.reservation.dayFormat,
  maxDays: config.reservation.maxDays
});

const formulas = require('./src/oracle/formulas')(conversationManager, interpretationLogger);
const prophecyInterpreter = new ProphecyInterpreter(formulas);

const messengerSettings = {
  "endpoint": config.services.facebook.messenger.API.messages
};
const messenger = new Messenger(prophecyInterpreter, messageLogger);
messenger.settings(messengerSettings);

const capabilities = require('./src/oracle/capabilities')(conversationManager, messenger, assistant);
const oracle = new Oracle(capabilities, messenger, conversationManager, predictionLogger);

const {
  fbRouter,
  pickersRouter,
  mapsRouter,
  predictionsRouter,
  conversationsRouter,
  suggestionsRouter
} = require('./src/routers');

app.use('/fb', fbRouter(oracle, conversationManager, routeLogger));
app.use('/pickers', pickersRouter());
app.use('/maps', mapsRouter());
app.use('/predictions', predictionsRouter(oracle, conversationManager, routeLogger));
app.use('/conversations', conversationsRouter(conversationManager, routeLogger));
app.use('/suggestions', suggestionsRouter(assistant, conversationManager, routeLogger));

mongoose.connect(config.get('database').get('mongoUri'));

app.listen(config.get('port'));
