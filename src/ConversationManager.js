 'use strict';

const _ = require('lodash');

class ConversationManager {
  constructor() {
    this._conversions = {};
  }

  findOrCreateConversation(fbUserId) {
    if (!_.has(this._conversions, fbUserId)) {
      let conversionId = new Date().toISOString();

      this._conversions[fbUserId] = {
        id: conversionId,
        context: {
          recipientId: fbUserId
        }
      }
    }

    return this._conversions[fbUserId];
  }

  removeConversation(fbUserId) {
    delete this._conversions[fbUserId];
  }

  updateContext(fbUserId, context) {
    this._conversions[fbUserId].context = context;

    return context;
  }
}

module.exports = ConversationManager;
