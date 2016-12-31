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

const app = express();

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

winston.loggers.add('oracle', config.loggers.oracle);
winston.loggers.add('assistant', config.loggers.assistant);
winston.loggers.add('conversation', config.loggers.conversation);

const oracleLogger = winston.loggers.get('oracle');
const assistantLogger = winston.loggers.get('assistant');
const conversationLogger = winston.loggers.get('conversation');

const calendar = new GoogleCalendar(
  config.services.google.appId,
  config.services.google.appSecret,
  config.services.google.appAuthUri
);

calendar.setToken(config.services.google.users.sophy);

const conversationManager = new ConversationManager(conversationLogger);
const assistant = new Assistant(Employee, calendar, assistantLogger);

const formulas = require('./src/oracle/formulas')(conversationManager);
const prophecyInterpreter = new ProphecyInterpreter(formulas);

const messenger = new Messenger(prophecyInterpreter);

const capabilities = require('./src/oracle/capabilities')(conversationManager, messenger, assistant);
const oracle = new Oracle(capabilities, messenger, conversationManager, oracleLogger);

const {
  fbRouter,
  pickersRouter,
  predictionsRouter,
  conversationsRouter,
  suggestionsRouter
} = require('./src/routers')(oracle, conversationManager);

app.use('/fb', fbRouter);
app.use('/pickers', pickersRouter);
app.use('/predictions', predictionsRouter);
app.use('/conversations', conversationsRouter);
app.use('/suggestions', suggestionsRouter(assistant, conversationManager));

mongoose.connect(config.get('database').get('mongoUri'));

app.listen(config.get('port'));
