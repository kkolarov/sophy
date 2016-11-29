const _ = require('lodash');

const Employee = require('../../../../models/Employee');
const BookingAssistant = require('../../../../booking').BookingAssistant;

const assistant = new BookingAssistant(Employee);

module.exports = (() => {
  const dentistStep = (() => {
    return {
      update: (context) => {
        const cleanUp = (context) => {
          delete context.dentist_step;
        }

        const isExtened = (context) => {
          return _.isString(context.dentist) ? false : true;
        }

        const obligateClientToAddDentist = (context) => {
          context.dentist_step = true;
        }

        return new Promise((resolve, reject) => {
          if (context.dentist) {
            cleanUp(context);

            if (isExtened(context)) {
              reasonStep.update(context).then(context => {
                resolve(context);
              });
            } else {
              Employee.findEmployeeByName(context.dentist, (err, employee) => {
                context.dentist = {
                  name: employee.name,
                  pictureUrl: employee.pictureUrl,
                  calendarId: employee.calendarId
                };

                reasonStep.update(context).then(context => {
                  resolve(context);
                });
              });
            }

          } else {
            obligateClientToAddDentist(context);

            resolve(context);
          }
        });
      }
    }
  })();

  const reasonStep = (() => {
    return {
      update: (context) => {
        const cleanUp = (context) => {
          delete context.reason_step;
        }

        const obligateClientToAddReason = (context) => {
          context.reason_step = true;
        }

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
    return {
      update: (context) => {
        const cleanUp = (context) => {
          delete context.hour_step;
        }

        const obligateClientToAddTime = (context) => {
          context.hour_step = true;
        }

        return new Promise((resolve, reject) => {
          if (context.hour) {
            cleanUp(context);

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

  const confirmationStep = (() => {
    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          context.done = true;

          resolve(context);
        });
      }
    }
  })();

  const book = (() => {
    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          const request = {
            calendarId: context.dentist.calendarId,
            sender: context.recipient.name,
            description: {
              complaints: context.reason
            },
            day: context.day,
            hour: context.hour,
            estimation: {
              hours: 1,
              minutes: 30
            }
          };

          assistant.book(request, (exception, date) => {
            if (!exception) {
              context.done = true;
            } else {
              context.reserved_time = true;
            }

            resolve(context);
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
