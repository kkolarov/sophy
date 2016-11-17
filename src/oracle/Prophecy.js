'use strict';

/**
* This class represents a message that will be delivered to a client.
*
* @author Kamen Kolarov
*/
class Prophecy {

  constructor(recipientId, message = '', replies = [], entities = {}, context = {}) {
    this._recipientId = recipientId;
    this._message = message;
    this._replies = replies;
    this._entities = entities;
    this._context = context;
  }

  getReplies() {
    return this._replies;
  }

  getEntities() {
    return this._entities;
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
