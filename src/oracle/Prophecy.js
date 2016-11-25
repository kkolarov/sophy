'use strict';

/**
* This class represents a message that will be delivered to a client.
*
* @author Kamen Kolarov
*/
class Prophecy {

  constructor(recipientId, message, replies = [], context = {}) {
    this._recipientId = recipientId;
    this._message = message;
    this._replies = replies;
    this._context = context;
  }

  getReplies() {
    return this._replies;
  }

  getContext() {
    return this._context;
  }

  setRecipientId(recipientId) {
    this._recipientId = recipientId;
  }

  getRecipientId() {
    return this._recipientId;
  }

  getMessage() {
    return this._message;
  }
}

module.exports = Prophecy;
