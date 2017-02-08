'use strict';

const config = require('config');
const moment = require('moment');

const hash = require('object-hash')
const deepCopy = require('deepcopy');

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const Assistant = require('@fanatic/reservation/Assistant');
const BusyTimeError = require('@fanatic/reservation/errors/BusyTimeError');

const Messenger = require('@fanatic/messenger/Messenger');
const GoogleCalendar = require('@fanatic/reservation/calendars/GoogleCalendar');
const ConversationManager = require('@fanatic/conversations/NativeConversationManager');
const { Oracle, ProphecyInterpreter } = require('@fanatic/oracle');

const DentalVisitEstimator = require('../../../reservation/estimators/DentalVisitEstimator');

const MessengerBot = require('@fanatic/messenger/MessengerBot');

const tomorrow = moment().add(1, 'day');
const dayAfterTomorrow = moment().add(2, 'days');

const userTexts = {
  START: "Искам да си запиша час при зъболекар.",
  DENTIST: "Д-р Йонов",
  WRONG_DENTIST: "Д-р Коларов",
  COMPLAINT: "Болка в зъба",
  WRONG_COMPLAINT: "Болка в стомаха",
  HOUR: "10:00",
  WRONG_HOUR: "100:000",
  NEW_HOUR: "15:00",
  DAY: tomorrow.format("YYYY-MM-DD"),
  NEW_DAY: dayAfterTomorrow.format("YYYY-MM-DD"),
  WRONG_DAY: "10.200",
  CONFIRMATION: "Да",
  REJECTION: "Не"
};

const getRequest = (conversation, duration) => {
  const context = conversation.context;

  return {
    calendarId: context.dentist.calendarId,
    sender: context.recipient.name,
    description: {},
    day: conversation.metadata.day,
    hour: context.hour,
    duration: duration
  };
}

const compareConverations = (conversation1, conversation2) => {
  // console.log(conversation1.context);
  // console.log(conversation2.context);

  const hashedContext1 = hash(conversation1.context);
  const hashedContext2 = hash(conversation2.context);

  return hashedContext1 == hashedContext2;
}

describe("The bot maintains a conversation", () => {

  before("Setup", () => {
    const that = this;

    const logger = sinon.stub();
    logger.returns({
      debug: function(text, options) {},
      error: function(text, options) {}
    });

    const messenger = sinon.stub();
    messenger.returns({
      deliver: (prophecy) => {
        return Promise.resolve(true);
      }
    });

    return mongoose.connect(config.database.mongoUri)
      .then(() => {
        const Employee = require('../../../models/Employee');
        const User = require('../../../models/User');
        const Page = require('../../../models/Page');

        this.calendar = new GoogleCalendar(
          config.services.google.appId,
          config.services.google.appSecret,
          config.services.google.appAuthUri
        );
        this.calendar.setToken(config.services.google.users.sophy);

        this.conversationManager = new ConversationManager(logger());

        this.estimator = new DentalVisitEstimator();
        this.assistant = new Assistant(Employee, this.calendar, logger(), {
          dateFormat: config.reservation.dateFormat,
          dayFormat: config.reservation.dayFormat,
          maxDays: config.reservation.maxDays
        });

        const formulas = require('../../../oracle/formulas')(this.conversationManager, logger());
        const prophecyInterpreter = new ProphecyInterpreter(formulas);

        const capabilities = require('../../../oracle/capabilities')(this.conversationManager, messenger(), this.assistant);
        this.oracle = new Oracle(capabilities, messenger(), this.conversationManager, logger());

        this.sophy = new MessengerBot(this.oracle, this.conversationManager, User, Page, logger());
        this.sophy.settings({
          pageValidationToken: config.services.facebook.pageValidationToken,
          fbGraphURI: config.services.facebook.API.graph,
          status: {
            completed: config.bot.conversation.status.completed
          }
        });
      })
      .catch(err => console.log(err));
  });

  before("A random user will be loaded that have gone through the reservation procedure.", () => {
    const User = require('../../../models/User');

    return User.findUsers()
      .then(users => {
        if (users.length > 0) {
          this.user = users[0];
        } else {
          return Promise.reject(new Error('There are no users that have gone through the reservation procedure.'));
        }
      });
  });

  beforeEach("All reservations within 2 months will be deleted from a calendar.", () => {
    const calendarId = config.calendars.id;

    const date = {
      start: new Date(),
      end: new Date(moment().add(2, 'months').format(config.reservation.dayFormat))
    };

    return this.calendar.deleteEvents(calendarId, date);
  });

  context("that recognizes terms of the reservation cycle.", () => {

  });

  context("that ends up with a reservation given that", () => {

    it("all steps are gone through without mistakes.", () => {
      const userId = this.user.recipientId;
      const pageId = this.user._page.pageId;

      return this.sophy.startConversation(userId, pageId)
        .then(() => {
          return this.sophy.respond(userId, userTexts.START, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.DENTIST, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.COMPLAINT, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.HOUR, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.NEW_HOUR, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.DAY, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request);
            });
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request)
                .catch(err => {
                  expect(err).instanceof(BusyTimeError);
                });
            });
        });
    });

    it("on each step the first user's response is wrong.", () => {
      const userId = this.user.recipientId;
      const pageId = this.user._page.pageId;

      let prevConversation = null;

      return this.sophy.startConversation(userId, pageId)
        .then(() => {
          return this.sophy.respond(userId, userTexts.WRONG_DENTIST, pageId);
        })
        .then(conversation => {
          prevConversation = deepCopy(conversation);

          return this.sophy.respond(userId, userTexts.DENTIST, pageId);
        })
        .then(conversation => {
          if (compareConverations(prevConversation, conversation)) {
            expect(true).to.be.false;
          }

          prevConversation = deepCopy(conversation);

          return this.sophy.respond(userId, userTexts.WRONG_COMPLAINT, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.COMPLAINT, pageId);
        })
        .then(conversation => {
          if (compareConverations(prevConversation, conversation)) {
            expect(true).to.be.false;
          }

          return this.sophy.respond(userId, userTexts.WRONG_HOUR, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.HOUR, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.WRONG_DAY, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.DAY, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request);
            });
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request)
                .catch(err => {
                  expect(err).instanceof(BusyTimeError);
                });
            });
        });
    });

    // it("in the middle of the reservation lifecycle the user decides to start again.", () => {
    //   const userId = this.user.recipientId;
    //   const pageId = this.user._page.pageId;
    //
    //   let prevConversation = null;
    //
    //   return this.sophy.startConversation(userId, pageId)
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.START, pageId);
    //     })
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.DENTIST, pageId);
    //     })
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.COMPLAINT, pageId);
    //     })
    //     .then(conversation => {
    //       prevConversation = conversation;
    //
    //       return this.sophy.respond(userId, userTexts.START, pageId);
    //     })
    //     .then(conversation => {
    //       if (compareConverations(prevConversation, conversation)) {
    //         expect(false).to.be.true;
    //       }
    //
    //       return this.sophy.respond(userId, userTexts.DENTIST, pageId);
    //     })
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.COMPLAINT, pageId);
    //     })
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.HOUR, pageId);
    //     })
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
    //     })
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.DAY, pageId);
    //     })
    //     .then(conversation => {
    //       const context = conversation.context;
    //
    //       return this.estimator.estimate(context)
    //         .then(duration => {
    //           const request = getRequest(conversation, duration);
    //
    //           return this.assistant.validate(request);
    //         });
    //     })
    //     .then(() => {
    //       return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
    //     })
    //     .then(conversation => {
    //       const context = conversation.context;
    //
    //       return this.estimator.estimate(context)
    //         .then(duration => {
    //           const request = getRequest(conversation, duration);
    //
    //           return this.assistant.validate(request)
    //             .catch(err => {
    //               expect(err).instanceof(BusyTimeError);
    //             });
    //         });
    //     });
    // });
  });

  context("that ends up with two reservations", () => {

    it("all steps are gone through without mistakes.", () => {
      const userId = this.user.recipientId;
      const pageId = this.user._page.pageId;

      return this.sophy.startConversation(userId, pageId)
        .then(() => {
          return this.sophy.respond(userId, userTexts.START, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.DENTIST, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.COMPLAINT, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.HOUR, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.DAY, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request);
            });
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request)
                .catch(err => {
                  if (err instanceof BusyTimeError) {
                    return true;
                  }
                });
            });
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.START, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.DENTIST, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.COMPLAINT, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.NEW_HOUR, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.NEW_DAY, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request);
            });
        })
        .then(() => {
          return this.sophy.respond(userId, userTexts.CONFIRMATION, pageId);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = getRequest(conversation, duration);

              return this.assistant.validate(request)
                .catch(err => {
                  expect(err).instanceof(BusyTimeError);
                });
            });
        })
    });
  });

  after("Cleanup", () => {
    mongoose.connection.close();
  });
});