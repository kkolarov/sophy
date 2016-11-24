'use strict';

/**
*
* @author Kamen Kolarov
*/
class QuickReply {

  constructor(recipientId, message = '', replies = []) {
    this._recipientId = recipientId;
    this._message = message;
    this._replies = replies;
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

    if (this._replies.length !== 0) {
      let replies = [];

      for (let i = 0; i < this._replies.length; ++i) {
        replies.push({
          content_type: 'text',
          title: this._replies[i],
          payload: this._replies[i]
        });
      }

      body.message.quick_replies = replies;
    }

    return body;
  }
}

module.exports = QuickReply;
