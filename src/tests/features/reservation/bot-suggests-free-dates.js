'use strict';

const config = require('config');
let mock = require('mock-require');

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let mongoose = require('mongoose');
let mockgoose = require('mockgoose');

const moment = require('moment');

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

    mongoose.connect(config.database.mongoUri, (err) => {
      if (!err) {
        const Employee = require('../../../models/Employee');

        that.assistant = new Assistant(Employee, calendar);

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

    calendar.deleteEvents(calendarId, date).then((flag) => {
      done();
    });
  });

  beforeEach("Recovery the app configuration.", () => {
    config.reservation.suggester.maxDays = maxDays;
  });

  context("given that a request is invalid because", () => {
    it("the day doesn't comply with the appropriate format.", (done) => {
      const sample = samples.getSampleWithInvalidDay();

      this.assistant.suggest(sample, assertThatFailWith(done, exception => {
        expect(exception).instanceof(InvalidDayFormatError);
      }));
    });

    it("the hour doesn't comply with the appropriate format.", (done) => {
      const sample = samples.getSampleWithInvalidHour();

      this.assistant.suggest(sample, assertThatFailWith(done, exception => {
        expect(exception).instanceof(InvalidHourFormatError);
      }));
    });
  });

  context("given that a request is valid", () => {

    it("whether the number of returned suggestions responds to the number of suggestins described in the configuration.", (done) => {
      const sample = samples.getSampleWithValidRequest();

      const maxSuggestions = config.reservation.suggester.maxSuggestions;

      this.assistant.suggest(sample, assertThatSuccessWith(done, (response) => {
        expect(response).to.have.lengthOf(maxSuggestions);
      }));
    });

    it("whether the number of returned suggestions is 0 when the configuration property maxDays=0.", (done) => {
      const sample = samples.getSampleWithValidRequest();

      config.reservation.suggester.maxDays = 0;

      this.assistant.suggest(sample, assertThatSuccessWith(done, (response) => {
        expect(response).to.have.lengthOf(config.reservation.suggester.maxDays);
      }));
    });
  });

  after("Clean up", () => {
    mongoose.connection.close();
  });
});
