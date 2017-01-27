'use strict';

const config = require('config');

const chai = require('chai');
const expect = chai.expect;

const mongoose = require('mongoose');
const moment = require('moment');

const samples = require('./request-samples');

const {
  BusyTimeError,
  OutsideWorkingTimeError,
  ExpiredDateError,
  InvalidDayFormatError,
  InvalidHourFormatError
} = require('@fanatic/reservation').errors;

const Assistant = require('@fanatic/reservation').Assistant;
const { GoogleCalendar } = require('@fanatic/reservation').calendars;

const calendar = new GoogleCalendar(
  config.services.google.appId,
  config.services.google.appSecret,
  config.services.google.appAuthUri
);

calendar.setToken(config.services.google.users.sophy);

const maxDays = config.reservation.suggester.maxDays;

describe("The bot suggests dates that are free for reservation", () => {

  before("Setup", (done) => {
    const that = this;

    const logger = {
      debug: (text, options) => {},
      error: (text, options) => {}
    };

    mongoose.connect(config.database.mongoUri, (err) => {
      if (!err) {
        const Employee = require('../../../models/Employee');

        that.assistant = new Assistant(Employee, calendar, logger);

        done();
      }
    });
  });

  beforeEach("Clear up calendar's events.", (done) => {
    const calendarId = config.calendars.id;

    const dayFormat = config.reservation.adapter.date.format.day;

    const date = {
      start: new Date(),
      end: new Date(moment().add(1, 'months').format(dayFormat))
    };

    calendar.deleteEvents(calendarId, date).then(() => {
      done();
    });
  });

  beforeEach("Recovery the app configuration.", () => {
    config.reservation.suggester.maxDays = maxDays;
  });

  context("given that a request is invalid because", () => {
    it("the day doesn't comply with the appropriate format.", () => {
      const sample = samples.getSampleWithInvalidDay();

      return this.assistant.suggest(sample).catch(err => {
          expect(err).instanceof(InvalidDayFormatError);
        });
    });

    it("the hour doesn't comply with the appropriate format.", () => {
      const sample = samples.getSampleWithInvalidHour();

      return this.assistant.suggest(sample).catch(err => {
          expect(err).instanceof(InvalidHourFormatError);
        });
    });
  });

  context("given that a request is valid", () => {

    it("whether the number of returned suggestions responds to the number of suggestins described in the configuration.", () => {
      const sample = samples.getSampleWithValidRequest();

      const options = {
        maxResult: 5
      };

      return this.assistant.suggest(sample, options).then(response => {
          expect(response).to.have.lengthOf(options.maxResult);
        });
    });

    it("whether the number of returned suggestions is 0 when the configuration property maxDays=0.", () => {
      const sample = samples.getSampleWithValidRequest();

      config.reservation.suggester.maxDays = 0;

      return this.assistant.suggest(sample).then(response => {
          expect(response).to.have.lengthOf(config.reservation.suggester.maxDays);
        });
    });
  });

  after("Clean up", () => {
    mongoose.connection.close();
  });
});
