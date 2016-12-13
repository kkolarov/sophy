'use strict';

/**
*
* @author Kamen Kolarov
*/
class DentistsGallery {

  constructor(recipientId, dentists) {
    this._recipientId = recipientId;
    this._dentists = dentists;
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
            elements: []
          }
        }
      }
    };

    if (this._dentists.length !== 0) {
      let elements = [];

      for (let i = 0; i < this._dentists.length; ++i) {
        let dentist = this._dentists[i];

        let element = {
          title: dentist.name,
          subtitle: dentist.aboutMe,
          image_url: dentist.pictureUrl,
          buttons: [{
            type: 'postback',
            title: dentist.name,
            payload: dentist.name
          }]
        };

        elements.push(element);
      }

      body.message.attachment.payload.elements = elements;
    }

    return body;
  }
}

module.exports = DentistsGallery;
