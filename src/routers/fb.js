'use strict';

const express = require('express');
const config = require('config');

const Bot = require('@fanatic/messenger').Bot;

const User = require('../models/User');
const Page = require('../models/Page');

function fbRouter(oracle, conversationManager) {
  const router = express.Router();

  const bot = new Bot(conversationManager, User, Page);

  bot.settings({
    pageValidationToken: config.services.facebook.pageValidationToken,
    pageAccessToken: config.services.facebook.pageAccessToken,
    fbGraphURI: config.services.facebook.API.graph
  });

  bot.on('message', function(event) {
    const text = event.message;
    const userId = event.sender.id;
    const pageId = event.recipient.id;

    this.loadConversation(userId, pageId)
      .then(conversation => {
        oracle.think(userId, conversation);
        oracle.predict(userId, text, conversation);
      })
      .catch(err => {
        console.log(err);
      });
  });

  bot.on('postback', function(event) {
    const payload = event.postback.payload;
    const pageId = event.recipient.id;
    const userId = event.sender.id;

    this.loadConversation(userId, pageId)
      .then(conversation => {
        setTimeout(() => {
          oracle.think(userId, conversation);
          oracle.predict(userId, payload, conversation);
        }, 1000);
      }).
      catch(err => {
        console.log(err);
      });
  });

  router.get('/', (req, res) => {
    bot.verify(req, res);
  });

  router.post('/', (req, res) => {
    bot.handle(req.body);

    res.sendStatus(200);
  });

  return router;
}

module.exports = fbRouter;
