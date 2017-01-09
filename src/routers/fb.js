'use strict';

const express = require('express');
const config = require('config');

const Bot = require('@fanatic/messenger').Bot;

const User = require('../models/User');
const Page = require('../models/Page');

const BOT_START = config.bot.start;

function fbRouter(oracle, conversationManager, logger) {
  const router = express.Router();

  const bot = new Bot(conversationManager, User, Page, logger);

  bot.settings({
    pageValidationToken: config.services.facebook.pageValidationToken,
    fbGraphURI: config.services.facebook.API.graph
  });

  bot.on('message', function(event) {
    const text = event.message.text;
    const userId = event.sender.id;
    const pageId = event.recipient.id;

    this.loadConversation(userId, pageId)
      .then(conversation => {
        oracle.think(userId, conversation);
        oracle.predict(userId, text, conversation).catch(err => {
          if (err instanceof Error) {
            logger.debug(err.stack);
          }
        });
      })
      .catch(err => {
        if (err instanceof Error) {
          logger.debug(err.stack);
        }
      });
  });

  bot.on('postback', function(event) {
    const payload = event.postback.payload;
    const pageId = event.recipient.id;
    const userId = event.sender.id;

    // TODO: Fix the methods calling when the conversation manager is instance of Redis.
    if (BOT_START === payload) {
      conversationManager.removeConversationByUserId(userId);
    }

    this.loadConversation(userId, pageId)
      .then(conversation => {
        oracle.think(userId, conversation);
        oracle.predict(userId, payload, conversation).catch(err => {
          if (err instanceof Error) {
            logger.debug(err.stack);
          }
        });
      }).
      catch(err => {
        if (err instanceof Error) {
          logger.debug(err.stack);
        }
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
