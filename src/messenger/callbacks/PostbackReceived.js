'use strict';

const Callback = require('./Callback');

/**
*
* @author Kamen Kolarov
*/
class PostbackReceived extends Callback {

  constructor(objType, pageId, senderId, recipientId, payload) {
    super(objType, pageId, senderId, recipientId);

    this._payload = payload;
  }

  setPayload(payload) {
    this._payload = payload;
  }

  getPayload() {
    return this._payload;
  }
}

module.exports = PostbackReceived;
