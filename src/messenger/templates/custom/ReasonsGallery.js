'use strict';

/**
*
* @author Kamen Kolarov
*/
class ReasonsGallery {

  constructor(recipientId, reasons) {
    this._recipientId = recipientId;
    this._reasons = reasons;
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

    if (this._reasons.length !== 0) {
      body.message.attachment.payload.elements = this._reasons;
    }

    return body;
  }
}

module.exports = ReasonsGallery;
