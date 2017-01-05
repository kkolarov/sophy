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

const contextManager = (manager, assistant) => {

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

    const cleanUp = (context) => {
      delete context.hour_step;
      delete context.yes_no;
    }

    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          if (context.hour) {
            cleanUp(context);

            dayStep.update(context).then(context => {
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

  const dayStep = (() => {
    const cleanUp = (context) => {
      delete context.day_step;
      delete context.yes_no;
    }

    const obligateClientToAddDay = (context) => {
      context.day_step = true;
    }

    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          if (context.day) {
            cleanUp(context);

            book.update(context)
              .then(context => {
                resolve(context);
              });
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
              manager.findConversationByUserId(context.recipient.id)
                .then(conversation => {
                  const request = {
                    calendarId: context.dentist.calendarId,
                    sender: context.recipient.name,
                    description: {
                      complaints: context.reason
                    },
                    day: conversation.metadata.day,
                    hour: context.hour,
                    duration: duration
                  };

                  assistant.book(request, (err, date) => {
                    if (!err) {
                      context.done = true;

                      resolve(context);
                    } else {
                      reject(err);
                    }
                  });
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
}

const book = (manager, assistant) => {
  return ({context, entities}) => {
    return new Promise(function(resolve, reject) {
      const extractedEntities = extractor.extract(entities);
      const mergedContext = _.merge(context, extractedEntities);

      contextManager(manager, assistant).update(mergedContext)
        .then(context => {
          resolve(context);
        }).catch(err => {
          console.log(err);
        });
    });
  }
}

module.exports = book;
