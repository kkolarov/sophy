'use strict';

/**
*
* @author Kamen Kolarov
*/
class Card {

  constructor(recipientId, message, replies, imageUrl, description) {
    this._recipientId = recipientId;
    this._message = message;
    this._replies = replies;
    this._imageUrl = imageUrl;
    this._description = description;
  }

  getTemplate() {
    let body = {
      recipient: {
        id: this._recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: "generic",
            elements: [{
              title: this._message,
              subtitle: this._description,
              image_url: this._imageUrl
            }]
          }
        }
      }
    };

    if (this._replies.length !== 0) {
      let replies = [];

      for (let i = 0; i < this._replies.length; ++i) {
        replies.push({
          type: 'postback',
          title: this._replies[i],
          payload: this._replies[i]
        })
      }

      body.message.attachment.payload.elements[0].buttons = replies;
    }

    return body;
  }
}

module.exports = Card;
