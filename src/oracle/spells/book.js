'use strict';

const config = require('config');
const _ = require('lodash');

const Assistant = require('@fanatic/reservation').Assistant;
const { GoogleCalendar } = require('@fanatic/reservation').calendars;
const { DentalVisitEstimator } = require('../../reservation/estimators');

const Employee = require('../../models/Employee');
const EntityExtractor = require('./utilities/EntityExtractor');

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

const calendar = new GoogleCalendar(
  config.services.google.appId,
  config.services.google.appSecret,
  config.services.google.appAuthUri
);

calendar.setToken(config.get('services').get('google').get('users').get('sophy'));

const assistant = new Assistant(Employee, calendar);

const contextManager = (() => {

  const dentistStep = (() => {
    const obligateClientToAddDentist = (context) => {
      context.dentist_step = true;
    }

    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          if (context.dentist) {
            reasonStep.update(context).then(context => {
              resolve(context);
            });
          } else {
            obligateClientToAddDentist(context);
            resolve(context);
          }
        });
      }
    }
  })();

  const reasonStep = (() => {
    const cleanUp = (context) => {
      delete context.reason_step;
    }

    const obligateClientToAddReason = (context) => {
      context.reason_step = true;
    }

    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          if (context.reason) {
            cleanUp(context);

            hourStep.update(context).then(context => {
              resolve(context);
            });
          } else {
            obligateClientToAddReason(context);
            resolve(context);
          }
        });
      }
    }
  })();

  const hourStep = (() => {
    const obligateClientToAddTime = (context) => {
      context.hour_step = true;
    }

    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          if (context.hour) {
            suggestionStep.update(context).then(context => {
              resolve(context);
            });
          } else {
            obligateClientToAddTime(context);

            resolve(context);
          }
        });
      }
    }
  })();

  const suggestionStep = (() => {
    const cleanUp = (context) => {
      delete context.suggestion_step;
    }

    const obligateClientToAddDay = (context) => {
      context.suggestion_step = true;
    }

    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          if (context.day) {
            cleanUp(context);

            book.update(context)
              .then(context => {
                resolve(context);
              })
          } else {
            obligateClientToAddDay(context);

            resolve(context);
          }
        });
      }
    }
  })();

  const book = (() => {
    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          estimator.estimate(context)
            .then(duration => {
              const request = {
                calendarId: context.dentist.calendarId,
                sender: context.recipient.name,
                description: {
                  complaints: context.reason
                },
                day: context.day,
                hour: context.hour,
                duration: duration
              };

              assistant.book(request, (exception, date) => {
                if (!exception) {
                  context.done = true;
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
  })();

  return {
    update: (context) => {
      return new Promise((resolve, reject) => {
        dentistStep.update(context).then((context) => {
          resolve(context);
        });
      });
    }
  };
})();

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    contextManager.update(mergedContext).then(context => {
      resolve(context);
    });
  });
};
