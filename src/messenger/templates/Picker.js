'use strict';

/**
*
* @author Kamen Kolarov
*/
class Picker {

  constructor(recipientId, title, description, imageUrl, buttonUrl, buttonText) {
    this._recipientId = recipientId;
    this._title = title;
    this._description = description;
    this._imageUrl = imageUrl;
    this._buttonUrl = buttonUrl;
    this._buttonText = buttonText;
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
            template_type: 'generic',
            elements: [
              {
                title: this._title,
                subtitle: this._description,
                image_url: this._imageUrl,
                buttons: [
                  {
                    type: 'web_url',
                    url: this._buttonUrl,
                    title: this._buttonText,
                    webview_height_ratio: 'tall',
                    messenger_extensions: true
                  }
                ]
              }
            ]
          }
        }
      }
    };

    return body;
  }
}

module.exports = Picker;
