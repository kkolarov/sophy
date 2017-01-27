'use strict';

const config = require('config');
const moment = require('moment');
const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const Assistant = require('@fanatic/reservation').Assistant;
const BusyTimeError = require('@fanatic/reservation').errors.BusyTimeError;

const Messenger = require('@fanatic/messenger').Messenger;
const GoogleCalendar = require('@fanatic/reservation').calendars.GoogleCalendar;
const ConversationManager = require(config.paths.ConversationManager);
const { Oracle, ProphecyInterpreter } = require('@fanatic/oracle');

const DentalVisitEstimator = require('../../../reservation/estimators').DentalVisitEstimator;

const Bot = require('@fanatic/messenger').Bot;

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
  NEW_HOUR: "10:15",
  DAY: tomorrow.format("YYYY-MM-DD"),
  NEW_DAY: dayAfterTomorrow.format("YYYY-MM-DD"),
  WRONG_DAY: "10.200",
  CONFIRMATION: "Да",
  REJECTION: "Не"
};

describe("The oracle predicts a conversation", () => {

  before("Setup", () => {
    mongoose.Promise = Promise;

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

        that.calendar = new GoogleCalendar(
          config.services.google.appId,
          config.services.google.appSecret,
          config.services.google.appAuthUri
        );
        that.calendar.setToken(config.services.google.users.sophy);

        that.conversationManager = new ConversationManager(logger());

        that.estimator = new DentalVisitEstimator();
        that.assistant = new Assistant(Employee, that.calendar, logger());

        const formulas = require('../../../oracle/formulas')(that.conversationManager, logger());
        const prophecyInterpreter = new ProphecyInterpreter(formulas);

        const capabilities = require('../../../oracle/capabilities')(that.conversationManager, messenger(), that.assistant);
        that.oracle = new Oracle(capabilities, messenger(), that.conversationManager, logger());

        that.bot = new Bot(that.conversationManager, User, Page, logger());
        that.bot.settings({
          pageValidationToken: config.services.facebook.pageValidationToken,
          fbGraphURI: config.services.facebook.API.graph,
          completedConversation: {
            property: config.bot.conversation.completed.property
          }
        });
      })
      .catch(err => console.log(err));
  });

  before("A random user will be loaded that have gone through the reservation procedure.", (done) => {
    mongoose.connect(config.database.mongoUri, (err) => {
      const User = require('../../../models/User');

      User.findUsers()
        .then(users => {
          if (users.length > 0) {
            this.user = users[0];

            done();
          } else {
            return Promise.reject(new Error('There are no users that has gone through the reservation procedure.'));
          }
        })
        .catch(err => {
          if (err instanceof Error) {
            console.log(err.stack);
          }
        });
    });
  });

  beforeEach("All reservations within 2 months will be deleted from a calendar.", (done) => {
    const calendarId = config.calendars.id;

    const date = {
      start: new Date(),
      end: new Date(moment().add(2, 'months').format(config.reservation.adapter.date.format.day))
    };

    this.calendar.deleteEvents(calendarId, date).then(() => {
      done();
    }).catch(err => console.log(err));
  });

  context("that ends up with a reservation", () => {

    it("starting with invalid responses.", () => {
      const userId = this.user.recipientId;
      const pageId = this.user._page.pageId;

      return this.bot.startConversation(userId, pageId)
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.START, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.WRONG_DENTIST, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.DENTIST, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.WRONG_COMPLAINT, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.COMPLAINT, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.WRONG_HOUR, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.HOUR, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.CONFIRMATION, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.WRONG_DAY, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.DAY, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.CONFIRMATION, conversation);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = {
                calendarId: context.dentist.calendarId,
                sender: context.recipient.name,
                description: {},
                day: conversation.metadata.day,
                hour: context.hour,
                duration: duration
              };

              return this.assistant.validate(request)
                .catch(err => {
                  if (err instanceof BusyTimeError) {
                    return true;
                  }
                });
            });
        })
        .then(validation => {
          expect(validation).to.be.true;
        })
        .catch(err => console.log(err));
    });

    it("walking through all steps.", () => {
      const userId = this.user.recipientId;
      const pageId = this.user._page.pageId;

      return this.bot.startConversation(userId, pageId)
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.START, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.DENTIST, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.COMPLAINT, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.HOUR, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.CONFIRMATION, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.NEW_HOUR, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.CONFIRMATION, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.DAY, conversation);
        })
        .then(conversation => {
          return this.oracle.predict(userId, userTexts.CONFIRMATION, conversation);
        })
        .then(conversation => {
          const context = conversation.context;

          return this.estimator.estimate(context)
            .then(duration => {
              const request = {
                calendarId: context.dentist.calendarId,
                sender: context.recipient.name,
                description: {},
                day: conversation.metadata.day,
                hour: context.hour,
                duration: duration
              };

              return this.assistant.validate(request)
                .catch(err => {
                  if (err instanceof BusyTimeError) {
                    return true;
                  }
                });
            });
        })
        .then(validation => {
          expect(validation).to.be.true;
        })
        .catch(err => console.log(err));
    });
  });

  after("Cleanup", () => {
    mongoose.connection.close();
  });
});
