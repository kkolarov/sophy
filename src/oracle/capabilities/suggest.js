'use strict';

const config = require('config');
const moment = require('moment');

const { DentalVisitEstimator } = require('../../reservation/estimators');
const estimator = new DentalVisitEstimator();

const suggest = (assistant) => {
  return ({ context, entities }) => {
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

          assistant.suggest(request, { maxResult: 5 })
            .then(suggestions => {
              context.suggestions = suggestions.map(suggestion => {
                return moment(suggestion.start).format('MM/DD/YYYY HH:mm');
              });

              resolve(context);
            }).catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = suggest;
