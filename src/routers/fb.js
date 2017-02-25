'use strict';

const config = require('config');
const qs = require('querystring');

const express = require('express');

const START_CONVERSATION = config.bot.conversation.start;

function fbRouter(sophy, logger) {
  const router = express.Router();

  sophy.on('referral', function(event) {
    const userId = event.sender.id;
    const pageId = event.recipient.id;
    const referral = event.referral.ref;

    const data = {
      metadata: {
        referral: qs.parse(referral)
      }
    };

    sophy.forget(userId)
      .then(() => {
        return sophy.respond(userId, START_CONVERSATION[0], pageId);
      })
      .then(() => {
        return sophy.store(userId, data);
      })
      .catch(err => {
        if (err instanceof Error) {
          logger.error(err.stack);
        } else {
          logger.error(err);
        }
      });
  });

  sophy.on('message', function(event) {
    const text = event.message.text;
    const userId = event.sender.id;
    const pageId = event.recipient.id;

    if (START_CONVERSATION.indexOf(text) > -1) {
      sophy.forget(userId)
        .then(() => {
          return sophy.respond(userId, text, pageId);
        })
        .catch(err => {
          if (err instanceof Error) {
            logger.error(err.stack);
          } else {
            logger.error(err);
          }
        });
    } else {
      sophy.hasMemento(userId)
        .then(predicate => {
          if (predicate) {
            return sophy.respond(userId, text, pageId);
          }
        })
        .catch(err => {
          if (err instanceof Error) {
            logger.error(err.stack);
          } else {
            logger.error(err);
          }
        });
    }
  });

  sophy.on('postback', function(event) {
    const payload = event.postback.payload;
    const pageId = event.recipient.id;
    const userId = event.sender.id;

    if (START_CONVERSATION.indexOf(payload) > -1) {
      sophy.forget(userId)
        .then(() => {
          return sophy.respond(userId, payload, pageId);
        })
        .catch(err => {
          if (err instanceof Error) {
            logger.error(err.stack);
          } else {
            logger.error(err);
          }
        });
    } else {
      sophy.hasMemento(userId, pageId)
        .then(predicate => {
          if (predicate) {
            return sophy.respond(userId, payload, pageId);
          }
        })
        .catch(err => {
          if (err instanceof Error) {
            logger.error(err.stack);
          } else {
            logger.error(err);
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
