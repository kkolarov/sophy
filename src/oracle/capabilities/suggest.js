'use strict';

const config = require('config');
const moment = require('moment');
const _ = require('lodash');

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

          assistant.suggest(request, {
            maxResult: 5
          }, (err, suggestions) => {
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
}

module.exports = suggest;
