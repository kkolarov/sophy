'use strict';

const moment = require('moment');
const config = require('config').get('messenger_templates').get('suggestions');

/**
*
* @author Kamen Kolarov
*/
class DatesGallery {

  constructor(recipientId, suggestions) {
    this._recipientId = recipientId;
    this._suggestions = suggestions;
  }

  _getDayOfWeek(suggestion) {
    const number = moment(new Date(suggestion)).weekday();
    let day = '';

    switch(number) {
      case 0:
        day = 'Неделя';
        break;
      case 1:
        day = 'Понеделник';
        break;
      case 2:
        day = 'Вторник';
        break;
      case 3:
        day = 'Сряда';
        break;
      case 4:
        day = 'Четвъртък';
        break;
      case 5:
        day = 'Петък';
        break;
      case 6:
        day = 'Събота';
        break;
    }

    return day;
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

    if (this._suggestions.length !== 0) {
      let elements = [];

      for (let i = 0; i < this._suggestions.length; ++i) {
        const suggestion = this._suggestions[i];
        const day = this._getDayOfWeek(suggestion);

        let element = {
          title: day,
          subtitle: moment(new Date(suggestion)).format('На MM/DD, HH:mm часа е свободен.'),
          image_url: config.get('days').get(day).get('imageUrl'),
          buttons: [{
            type: 'postback',
            title: 'Запазвам',
            payload: suggestion
          }]
        };

        elements.push(element);
      }

      for (let i = 0; i < config.get('mandatoryCards').length; ++i) {
        let element = config.get('mandatoryCards')[i];

        elements.push(element);
      }

      body.message.attachment.payload.elements = elements;
    }

    return body;
  }
}

module.exports = DatesGallery;
