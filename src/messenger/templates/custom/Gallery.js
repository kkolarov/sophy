'use strict';

class Gallery {

  constructor(recipientId, items) {
    this._recipientId = recipientId;
    this._items = items;
  }

  getTemplate() {
    let body = {
      recipient: {
        id: this._recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: []
          }
        }
      }
    };

    if (this._items.length !== 0) {
      let elements = [];

      for (let i = 0; i < this._items.length; ++i) {
        let item = this._items[i];

        let element = {
          title: item.title,
          subtitle: item.description,
          image_url: item.imageUrl,
          buttons: []
        };

        let buttons = [];

        for (let j = 0; j < item.buttons.length; ++j) {
          let button = item.buttons[j];
          buttons.push({
            "type": button.type,
            "title": button.text,
            "payload": button.payload
          });
        }

        element.buttons = buttons;
        elements.push(element);
      }

      body.message.attachment.payload.elements = elements;
    }

    return body;
  }
}

module.exports = Gallery;
