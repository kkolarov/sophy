 'use strict';

const _ = require('lodash');

class ConversationManager {
  constructor() {
    this._conversions = {};
  }

  findOrCreateConversation(user) {
    if (!_.has(this._conversions, user._id)) {
      let conversationId = new Date().toISOString();

      this._conversions[user._id] = {
        id: conversationId,
        context: {
          recipient: {
            id: user.recipientId,
            name: user.fullName
          }
        }
      }
    }

    return this._conversions[user._id];
  }

  removeConversation(user) {
    delete this._conversions[user._id];
  }

  updateContext(user, context) {
    this._conversions[user._id].context = context;

    return context;
  }
}

module.exports = ConversationManager;
