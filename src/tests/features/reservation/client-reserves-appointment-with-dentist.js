'use strict';

const config = require('config');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
const moment = require('moment');
const winston = require('winston');

const samples = require('./request-samples');

const {
  BusyTimeError,
  OutsideWorkingTimeError,
  ExpiredDateError,
  InvalidDayFormatError,
  InvalidHourFormatError
} = require('@fanatic/reservation').errors;

const { assertThatSuccessWith, assertThatFailWith } = require('../../assertion');

const Assistant = require('@fanatic/reservation').Assistant;
const { GoogleCalendar } = require('@fanatic/reservation').calendars;

winston.loggers.add('reservation', config.loggers.reservation);
const logger = winston.loggers.get('reservation');

describe("A client reserves time in a dentist's calendar", () => {

  before("Setup", (done) => {
    const that = this;

    mongoose.connect(config.get('database').get('mongoUri'), (err) => {
      if (!err) {
        const Employee = require('../../../models/Employee');

        this.calendar = new GoogleCalendar(
          config.services.google.appId,
          config.services.google.appSecret,
          config.services.google.appAuthUri
        );

        this.calendar.setToken(config.services.google.users.sophy);

        that.assistant = new Assistant(Employee, this.calendar, logger);

        done();
      }
    });
  });

  beforeEach("Clear up calendar's events.", (done) => {
    const calendarId = config.calendars.id;

    const date = {
      start: new Date(),
      end: new Date(moment().add(1, 'months').format(config.reservation.adapter.date.format.day))
    };

    this.calendar.deleteEvents(calendarId, date).then((flag) => {
      done();
    });
  });

  context("given that a request is invalid because", () => {
    it("the day doesn't comply with the appropriate format.", () => {
      const sample = samples.getSampleWithInvalidDay();

      return this.assistant.book(sample).catch(err => {
        expect(err).instanceof(InvalidDayFormatError);
      });
    });

    it("the hour doesn't comply with the appropriate format.", () => {
      const sample = samples.getSampleWithInvalidHour();

      return this.assistant.book(sample).catch(err => {
          expect(err).instanceof(InvalidHourFormatError);
        });
    });

    it("the date is expired.", () => {
      const sample = samples.getSampleWithRequestResidesInPast();

      return this.assistant.book(sample).catch(err => {
        expect(err).instanceof(ExpiredDateError);
      });
    });

    it("the date is reserved by someone else.", () => {
      const sample = samples.getSampleWithReservedHour();

      return this.assistant.book(sample)
        .then(appointment => {
          return this.assistant.book(sample).catch(err => {
            expect(err).instanceof(BusyTimeError);
          });
        });

    });

    it("the date resides in the outside working time.", () => {
      const sample = samples.getSampleWithRequestResidesOutsideWorkingTime();

      return this.assistant.book(sample).catch(err => {
        expect(err).instanceof(OutsideWorkingTimeError);
      });
    });
  });


  it("given that a request is valid", () => {
    const sample = samples.getSampleWithValidRequest();

    return this.assistant.book(sample).then(appointment => {
      expect(appointment).to.have.property('id');
    });
  });

  after("Clean up", () => {
    mongoose.connection.close();
  });
});
