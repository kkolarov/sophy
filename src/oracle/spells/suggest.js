'use strict';

const moment = require('moment');

const BookingAssistant = require('../../booking').BookingAssistant;
const Employee = require('../../models/Employee');

const assistant = new BookingAssistant(Employee);

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    const request = {
      calendarId: context.dentist.calendarId,
      sender: 'Kamen Kolarov',
      description: {
        phone: '',
        complaints: context.reason
      },
      day: context.day,
      hour: context.time,
      estimation: {
        hours: 1,
        minutes: 30
      }
    };

    assistant.suggest(request, (exception, suggestions) => {
      if (!exception) {
        let formatedSuggestions = [];

        for (let i = 0; i < suggestions.length; ++i) {
          formatedSuggestions.push(moment(suggestions[i].start).format('MM/DD/YYYY HH:mm'));
        }

        context.suggestions = formatedSuggestions;

        resolve(context);
      } else {
        console.log(exception);

        resolve(context);
      }
    });
  });
}
