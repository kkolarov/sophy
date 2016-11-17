'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const config = require('config');
const { Wit, log } = require('node-wit');

const ConversationManager = require('../ConversationManager');
const Messenger = require('../messenger').Messenger;
const Prophecy = require('./Prophecy');
const ProphecyInterpreter = require('./ProphecyInterpreter');

const helpers = require('./helpers');

/**
* This class maintains main features of the client-bot model.
*
* @author Kamen Kolarov
*/
class Oracle {

  constructor() {
    this._messenger = new Messenger(new ProphecyInterpreter(), {
      uri: config.get('fbUri'),
      accessToken: config.get('pageAccessToken')
    });

    this._wit = new Wit({
      accessToken: config.get('witAccessToken'),
      actions: helpers(this._messenger),
      logger: new log.Logger(log.DEBUG)
    });

    this._conversationManager = new ConversationManager();
  }

  /**
  * This method returns response to a client in the form of typing bubble.
  *
  * @param Number clientId recipient
  * @param Boolean on
  *
  * @return void
  */
  think(clientId, on = true) {
    this._messenger.deliver(new Prophecy(clientId, '', [], {}, { thinking: on }, (err, res) => {}));
  }

  /**
  * This method predicts the next bot action.
  *
  * @param Number clientId
  * @param String text client's query
  *
  * @return void
  */
  predict(clientId, text) {
    const conversation = this._conversationManager.findOrCreateConversation(clientId);

    this._wit.runActions(conversation.id, text, conversation.context)
    .then((context) => {
        if (_.has(context, 'done')) {
          console.log('A client conversation is done.')

          this._conversationManager.removeConversation(clientId);
        } else {
          console.log(chalk.blue(JSON.stringify(context)));

          this._conversationManager.updateContext(clientId, context);
        }
    });
  }
}

module.exports = Oracle;
