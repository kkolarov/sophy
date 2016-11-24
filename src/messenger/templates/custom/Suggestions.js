'use strict';

const moment = require('moment');
const config = require('config');

const dayOfWeek = (number) => {
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

/**
*
* @author Kamen Kolarov
*/
class SuggestionReply {

  constructor(recipientId, title, description, imageUrl, buttonText, suggestions) {
    this._recipientId = recipientId;
    this._title = title;
    this._description = description;
    this._imageUrl = imageUrl;
    this._buttonText = buttonText;
    this._suggestions = suggestions;
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
            template_type: 'list',
            elements: []
          }
        }
      }
    };

    let elements = [];

    elements.push({
      title: this._title,
      image_url: this._imageUrl,
      subtitle: this._description
    });

    for (let i = 0; i < this._suggestions.length; ++i) {
      let suggestion = this._suggestions[i];

      let day = dayOfWeek(moment(new Date(suggestion)).weekday());

      elements.push({
        title: day,
        subtitle: suggestion,
        buttons: [
          {
            title: this._buttonText,
            type: 'postback',
            payload: suggestion
          }
        ]
      });
    }

    body.message.attachment.payload.elements = elements;

    return body;
  }
}

module.exports = SuggestionReply;
