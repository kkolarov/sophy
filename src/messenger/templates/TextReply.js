'use strict';

class TextReply {

  constructor(recipientId, message) {
    this._recipientId = recipientId;
    this._message = message;
  }

  getTemplate() {
    let body = {
      recipient: {
        id: this._recipientId
      },
      message: {
        text: this._message
      }
    };

    return body;
  }
}

module.exports = TextReply;
