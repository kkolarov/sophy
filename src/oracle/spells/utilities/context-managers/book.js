const _ = require('lodash');

const Employee = require('../../../../models/Employee');
const BookingAssistant = require('../../../../booking').BookingAssistant;

const assistant = new BookingAssistant(Employee);

module.exports = (() => {
  const checkDentist = (() => {
    return {
      update: (context) => {
        const cleanUp = (context) => {
          delete context.missing_dentist;
        }

        const isExtened = (context) => {
          return _.isString(context.dentist) ? false : true;
        }

        const obligateClientToAddDentist = (context) => {
          context.missing_dentist = true;

        }

        return new Promise((resolve, reject) => {
          if (context.dentist) {
            cleanUp(context);

            if (isExtened(context)) {
              checkReason.update(context).then(context => {
                resolve(context);
              });
            } else {
              Employee.findEmployeeByName(context.dentist, (err, employee) => {
                context.dentist = {
                  name: employee.name,
                  pictureUrl: employee.pictureUrl,
                  calendarId: employee.calendarId
                };

                checkReason.update(context).then(context => {
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

  const checkReason = (() => {
    return {
      update: (context) => {
        const cleanUp = (context) => {
          delete context.missing_reason;
        }

        const obligateClientToAddReason = (context) => {
          context.missing_reason = true;
        }

        return new Promise((resolve, reject) => {
          if (context.reason) {
            cleanUp(context);

            checkDay.update(context).then(context => {
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

  const checkDay = (() => {
    return {
      update: (context) => {
        const cleanUp = (context) => {
          delete context.missing_day;
        }

        const obligateClientToAddDay = (context) => {
          context.missing_day = true;
        }

        return new Promise((resolve, reject) => {
          if (context.day) {
            cleanUp(context);

            checkHour.update(context).then(context => {
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

  const checkHour = (() => {
    return {
      update: (context) => {
        const cleanUp = (context) => {
          delete context.missing_hour;
        }

        const obligateClientToAddTime = (context) => {
          context.missing_hour = true;
        }

        return new Promise((resolve, reject) => {
          if (context.hour) {
            cleanUp(context);

            validation.update(context).then(context => {
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

  const validation = (() => {
    return {
      update: (context) => {
        return new Promise((resolve, reject) => {
          const request = {
            calendarId: context.dentist.calendarId,
            sender: 'Kamen Kolarov',
            description: {
              phone: '',
              complaints: context.reason
            },
            day: context.day,
            hour: context.hour,
            estimation: {
              hours: 1,
              minutes: 30
            }
          };

          console.log(request);

          assistant.validate(request, (exception, date) => {
            if (!exception) {
              context.validated = true;

              book.update(context).then(context => {
                resolve(context);
              });
            } else {
              console.log(exception);

              context.reserved_time = true;
              resolve(context);
            }
          });
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
            sender: 'Kamen Kolarov',
            description: {
              phone: '',
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
        checkDentist.update(context).then((context) => {
          resolve(context);
        });
      });
    }
  };
})();
