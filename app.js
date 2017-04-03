'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

const Employee = require('./src/models/Employee');
const User = require('./src/models/User');
const Page = require('./src//models/Page');

const Assistant = require('@fanatic/assistant/Assistant');
const Messenger = require('@fanatic/messenger/Messenger');
const GoogleCalendar = require('@fanatic/assistant/calendars/GoogleCalendar');
const MessengerBot = require('@fanatic/messenger/MessengerBot');
const { Oracle, ProphecyInterpreter } = require('@fanatic/oracle');
const ConversationManager = require(config.paths.ConversationManager);

const {
  fbRouter,
  policyRouter,
  pickersRouter,
  mapsRouter,
  predictionsRouter,
  conversationsRouter,
  suggestionsRouter
} = require('./src/routers');

mongoose.Promise = Promise;

winston.loggers.add('bot', config.loggers.bot);
winston.loggers.add('oracle', config.loggers.oracle);
winston.loggers.add('assistant', config.loggers.assistant);
winston.loggers.add('manager', config.loggers.manager);
winston.loggers.add('router', config.loggers.router);
winston.loggers.add('messenger', config.loggers.messenger);
winston.loggers.add('interpreter', config.loggers.interpreter);

const calendar = new GoogleCalendar(
  config.services.google.appId,
  config.services.google.appSecret,
  config.services.google.appAuthUri
);
calendar.setToken(config.services.google.users.sophy);

const conversationManager = new ConversationManager(winston.loggers.get('manager'));
const assistant = new Assistant(Employee, calendar, winston.loggers.get('assistant'), {
  dateFormat: config.reservation.dateFormat,
  dayFormat: config.reservation.dayFormat,
  maxDays: config.reservation.maxDays
});

const formulas = require('./src/oracle/formulas')(conversationManager, winston.loggers.get('interpreter'));
const prophecyInterpreter = new ProphecyInterpreter(formulas);

const messengerSettings = {
  endpoint: config.services.facebook.messenger.API.messages
};
const messenger = new Messenger(prophecyInterpreter, winston.loggers.get('messenger'));
messenger.settings(messengerSettings);

const capabilities = require('./src/oracle/capabilities')(conversationManager, messenger, assistant);
const oracle = new Oracle(capabilities, messenger, conversationManager, winston.loggers.get('oracle'));

const sophy = new MessengerBot(oracle, conversationManager, User, Page, winston.loggers.get('bot'));
sophy.settings({
  pageValidationToken: config.services.facebook.pageValidationToken,
  fbGraphURI: config.services.facebook.API.graph,
  status: {
    completed: config.bot.conversation.status.completed
  }
});

const app = express();

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/fb', fbRouter(sophy, winston.loggers.get('router')));
app.use('/policies', policyRouter());
app.use('/pickers', pickersRouter());
app.use('/maps', mapsRouter());
app.use('/predictions', predictionsRouter(oracle, conversationManager, winston.loggers.get('router')));
app.use('/conversations', conversationsRouter(conversationManager, winston.loggers.get('router')));
app.use('/suggestions', suggestionsRouter(assistant, conversationManager, winston.loggers.get('router')));

mongoose.connect(config.get('database').get('mongoUri'));

app.listen(config.get('port'));
