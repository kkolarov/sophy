'use strict';

/**
*
* @author Kamen Kolarov
*/
class TypingReply {

  constructor(recipientId, typing) {
    this._recipientId = recipientId;
    this._typing = typing;
  }

  getTemplate() {
    const body = {
      recipient: {
        id: this._recipientId
      },
      sender_action: this._typing
    };

    return body;
  }
}

module.exports = TypingReply;
