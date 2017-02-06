'use strict';

const config = require('config');

const express = require('express');

const BOT_START = config.bot.conversation.start;

function fbRouter(sophy, logger) {
  const router = express.Router();

  sophy.on('message', function(event) {
    const text = event.message.text;
    const userId = event.sender.id;
    const pageId = event.recipient.id;

    if (BOT_START.indexOf(text) > -1) {
      sophy.restartConversation(userId, pageId)
        .then(() => {
          sophy.respond(userId, text, pageId)
            .catch(err => {
              if (err instanceof Error) {
                logger.error(err.stack);
              }
            });
        });
    } else {
      sophy.respond(userId, text, pageId)
        .catch(err => {
          if (err instanceof Error) {
            logger.error(err.stack);
          }
        });
    }
  });

  sophy.on('postback', function(event) {
    const payload = event.postback.payload;
    const pageId = event.recipient.id;
    const userId = event.sender.id;

    if (BOT_START.indexOf(payload) > -1) {
      sophy.restartConversation(userId, pageId)
        .then(() => {
          sophy.respond(userId, payload, pageId)
            .catch(err => {
              if (err instanceof Error) {
                logger.error(err.stack);
              }
            });
        });
    } else {
      sophy.respond(userId, payload, pageId)
        .catch(err => {
          if (err instanceof Error) {
            logger.error(err.stack);
          }
        });
    }
  });

  router.get('/', (req, res) => {
    if (sophy.verify(req)) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.sendStatus(403);
    }
  });

  router.post('/', (req, res) => {
    sophy.handle(req.body);

    res.sendStatus(200);
  });

  return router;
}

module.exports = fbRouter;
