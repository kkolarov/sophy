'use strict';

const moment = require('moment');

const BookingAssistant = require('../../booking').BookingAssistant;
const Employee = require('../../models/Employee');
const DurationEstimator = require('../../utilities/estimators/duration').Dentist;

const assistant = new BookingAssistant(Employee);
const durationEstimator = new DurationEstimator();

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    durationEstimator.estimate(context)
      .then(duration => {
        const request = {
          calendarId: context.dentist.calendarId,
          sender: context.recipient.name,
          description: {},
          day: context.day || new Date(),
          hour: context.hour,
          duration: duration
        };

        console.log(request);

        assistant.suggest(request, (exception, suggestions) => {
          if (!exception) {
            let formatedSuggestions = [];

            for (let i = 0; i < suggestions.length; ++i) {
              formatedSuggestions.push(moment(suggestions[i].start).format('MM/DD/YYYY HH:mm'));
            }

            context.suggestions = formatedSuggestions;
          }
          resolve(context);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}
