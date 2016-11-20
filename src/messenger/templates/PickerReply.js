'use strict';

class PickerReply {

  constructor(recipientId, message, url) {
    this._recipientId = recipientId;
    this._message = message;
    this._url = url;
  }

  getTemplate() {
    let body = {
      "recipient" : {
        "id": this._recipientId
      },
      "message": {
        "attachment": {
          "type": "template",
             "payload": {
                "template_type": "button",
                "text": this._message,
                "buttons": [
                   {
                     "type": "web_url",
                     "url": this._url,
                     "title": "Избери",
                     "webview_height_ratio": "compact",
                     "messenger_extensions": true
                   }
                ]
             }
           }
        }
    };

    return body;
  }
}

module.exports = PickerReply;
