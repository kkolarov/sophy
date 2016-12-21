'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');

const ConversationManager = require(config.paths.ConversationManager);

const Messenger = require('@fanatic/messenger').Messenger;

const { Oracle, ProphecyInterpreter } = require('@fanatic/oracle');
const formulas = require('./src/oracle/formulas');
const capabilities = require('./src/oracle/capabilities');

const app = express();

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const conversationManager = new ConversationManager();
const messenger = new Messenger(new ProphecyInterpreter(conversationManager, formulas));
const oracle = new Oracle(capabilities, messenger, conversationManager);

const {
  fbRouter,
  pickersRouter,
  predictionsRouter,
  conversationsRouter
} = require('./src/routers')(oracle, conversationManager);

app.use('/fb', fbRouter);
app.use('/pickers', pickersRouter);
app.use('/predictions', predictionsRouter);
app.use('/conversations', conversationsRouter);

mongoose.connect(config.get('database').get('mongoUri'));

app.listen(config.get('port'));
