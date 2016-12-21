'use strict';

const config = require('config');
const moment = require('moment');
const _ = require('lodash');

const { Assistant } = require('@fanatic/reservation');
const { GoogleCalendar } = require('@fanatic/reservation').calendars;
const { DentalVisitEstimator } = require('../../reservation/estimators');

const Employee = require('../../models/Employee');

const calendar = new GoogleCalendar(
  config.services.google.appId,
  config.services.google.appSecret,
  config.services.google.appAuthUri
);

calendar.setToken(config.services.google.users.sophy);

const assistant = new Assistant(Employee, calendar);
const estimator = new DentalVisitEstimator();

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    estimator.estimate(context)
      .then(duration => {
        const request = {
          calendarId: context.dentist.calendarId,
          sender: context.recipient.name,
          description: {},
          day: context.day || moment(new Date()).format('MM/DD/YYYY'),
          hour: context.hour,
          duration: duration
        };

        assistant.suggest(request, (err, suggestions) => {
          if (!err) {
            context.suggestions = _.flatMap(suggestions, (suggestion) => {
              return moment(suggestion.start).format('MM/DD/YYYY HH:mm')
            });
          }

          resolve(context);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}
