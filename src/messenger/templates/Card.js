'use strict';

/**
*
* @author Kamen Kolarov
*/
class Card {

  constructor(recipientId, message, imageUrl, description, buttons) {
    this._recipientId = recipientId;
    this._message = message;
    this._imageUrl = imageUrl;
    this._description = description;
    this._buttons = buttons;
  }

  getTemplate() {
    return {
      recipient: {
        id: this._recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: this._message,
                subtitle: this._description,
                image_url: this._imageUrl,
                buttons: this._buttons
              }
            ]
          }
        }
      }
    };
  }
}

module.exports = Card;
