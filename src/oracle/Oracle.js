'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const config = require('config');
const { Wit, log } = require('node-wit');
const Prophecy = require('./Prophecy');

const spells = require('./spells');

/**
* This class maintains main features of the client-bot model.
*
* @author Kamen Kolarov
*/
class Oracle {

  constructor(conversationManager, messenger) {
    this._conversationManager = conversationManager;
    this._messenger = messenger;

    this._wit = new Wit({
      accessToken: config.get('services').get('wit').get('accessToken'),
      actions: spells(this._messenger),
      logger: new log.Logger(log.DEBUG)
    });
  }

  /**
  * This method returns response to a client in the form of typing bubble.
  *
  * @param JSON user
  * @param Boolean on
  *
  * @return Promise
  */
  think(user, on = true) {
    return new Promise((resolve, reject) => {
      this._messenger.deliver(new Prophecy(user.recipientId, '', [], { thinking: on }, (exception, flag) => {
        if (!exception) {
          reject(exception);
        } else {
          resolve(flag);
        }
      }));
    });
  }

  /**
  * This method predicts the next bot action.
  *
  * @param JSON user
  * @param String text user's query
  *
  * @return void
  */
  predict(user, text) {
    const conversation = this._conversationManager.findOrCreateConversation(user);

    this._wit.runActions(conversation.id, text, conversation.context)
    .then((context) => {
        if (_.has(context, 'done')) {
          this._conversationManager.removeConversation(user);
        } else {
          console.log(chalk.blue(JSON.stringify(context)));

          this._conversationManager.updateContext(user, context);
        }
    });
  }
}

module.exports = Oracle;
