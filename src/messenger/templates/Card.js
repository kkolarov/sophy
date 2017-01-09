'use strict';

/**
*
* @author Kamen Kolarov
*/
class Card {

  constructor(recipientId, message, buttons, imageUrl, description) {
    this._recipientId = recipientId;
    this._message = message;
    this._buttons = buttons;
    this._imageUrl = imageUrl;
    this._description = description;
  }

  getTemplate() {
    const body = {
      recipient: {
        id: this._recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: this._message,
              subtitle: this._description,
              image_url: this._imageUrl,
              buttons: this._buttons
            }]
          }
        }
      }
    };

    return body;
  }
}

module.exports = Card;
