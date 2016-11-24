'use strict';

const Callback = require('./Callback');

/**
*
* @author Kamen Kolarov
*/
class MessageReceived extends Callback {

  constructor(objType, pageId, senderId, recipientId, event) {
    super(objType, pageId, senderId, recipientId);

    this._event = event;
  }

  getId() {
    return this._event.mid;
  }

  getText() {
    return this._event.text;
  }

  isEcho() {
    return this._event.is_echo ? this._event.is_echo : false;
  }
}

module.exports = MessageReceived;
