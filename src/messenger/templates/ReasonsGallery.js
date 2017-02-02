'use strict';

/**
*
* @author Kamen Kolarov
*/
class ReasonsGallery {

  constructor(recipientId, reasons = []) {
    this._recipientId = recipientId;
    this._reasons = reasons;
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
            elements: this._reasons
          }
        }
      }
    };
  }
}

module.exports = ReasonsGallery;
