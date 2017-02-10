'use strict';

const config = require('config');
const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');
const DentalVisitEstimator = require('../../reservation/estimators').DentalVisitEstimator;

const estimator = new DentalVisitEstimator();
const extractor = new EntityExtractor({
  dentist: {
    extract: true
  },
  reason: {
    extract: true,
    metadata: {
      extract: true,
      parse: true
    }
  },
  hour: {
    extract: true
  },
  day: {
    extract: true
  }
});

const {
  BusyTimeError,
  OutsideWorkingTimeError,
  ExpiredDateError,
  InvalidDayFormatError,
  InvalidHourFormatError
} = require('@fanatic/reservation/errors');

const dentistStep = (context) => {
  if (context.dentist) {
    delete context.dentist_step;
    return true;
  }
  context.dentist_step = true;
  return false;
}

const reasonStep = (context) => {
  if (context.reason) {
    delete context.reason_step;
    return true;
  }

  context.reason_step = true;
  return false;
}

const hourStep = (context) => {
  if (context.hour) {
    delete context.hour_step;
    return true;
  }

  context.hour_step = true;
  return false;
}

const dayStep = (context) => {
  if (context.day) {
    delete context.day_step;
    return true;
  }

  delete context.yes_no;
  context.day_step = true;
  return false;
}

const book = (manager, assistant) => {
  return ({context, entities}) => {
    return new Promise(function(resolve, reject) {
      const extractedEntities = extractor.extract(entities);
      const mergedContext = _.merge(context, extractedEntities);

      const handlers = [dentistStep, reasonStep, hourStep, dayStep];

      let currentHandler = 0;

      for (let handler of handlers) {
        if (!handler(mergedContext)) {
          break;
        }

        currentHandler++;
      }

      if (currentHandler === handlers.length) {
        estimator.estimate(mergedContext)
          .then(duration => {
            return manager.findConversationByUserId(mergedContext.recipient.id)
              .then(conversation => {
                const request = {
                  calendarId: context.dentist.calendarId,
                  sender: context.recipient.name,
                  description: {
                    referral: conversation.metadata.referral || {}
                  },
                  day: conversation.metadata.day,
                  hour: context.hour,
                  duration: duration
                };

                return assistant.book(request);
              })
              .then(() => {
                mergedContext.done = true;

                resolve(mergedContext);
              });
          })
          .catch(err => {
            if (err instanceof BusyTimeError) {
              mergedContext.busy_time_error = true;

              resolve(mergedContext);
            } else if (err instanceof OutsideWorkingTimeError) {
              mergedContext.outside_working_time_error = true;

              resolve(mergedContext);
            } else if (err instanceof ExpiredDateError) {
              mergedContext.expired_date_error = true;

              resolve(mergedContext);
            } else {
              reject(err);
            }
          });
      } else {
        resolve(mergedContext);
      }
    });
  }
}

module.exports = book;
