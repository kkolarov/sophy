 'use strict';

const _ = require('lodash');

class ConversationManager {
  constructor() {
    this._conversions = {};
  }

  findOrCreateConversation(user) {
    if (!_.has(this._conversions, user.recipientId)) {
      let conversationId = new Date().toISOString();

      this._conversions[user.recipientId] = {
        id: conversationId,
        context: {
          recipient: {
            id: user.recipientId,
            name: user.fullName
          }
        }
      }
    }

    return this._conversions[user.recipientId];
  }

  removeConversation(user) {
    delete this._conversions[user.recipientId];
  }

  updateContext(user, context) {
    this._conversions[user.recipientId].context = context;

    return context;
  }
}

module.exports = ConversationManager;
