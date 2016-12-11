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
} = require('../../../booking/errors');

const { assertThatSuccessWith, assertThatFailWith } = require('../../assertion');

const GoogleCalendar = require('../../../booking/calendars/google-calendar').GoogleCalendar;
const BookingAssistant = require('../../../booking').BookingAssistant;

const calendar = new GoogleCalendar(
  config.get('services').get('google').get('appId'),
  config.get('services').get('google').get('appSecret'),
  config.get('services').get('google').get('appAuthUri')
);

calendar.setToken(config.get('services').get('google').get('users').get('sophy'));

const maxDays = config.get('suggester').get('maxDays');

describe("The bot suggests dates that are free for reservation", () => {

  before("Setup", (done) => {
    const that = this;

    mongoose.connect('mongodb://localhost/sophy-testing', (err) => {
      if (!err) {
        const Employee = require('../../../models/Employee');

        that.assistant = new BookingAssistant(Employee, calendar);

        done();
      }
    });
  });

  beforeEach("Clear up calendar's events.", (done) => {
    const calendarId = config.get('calendars').get('id');

    const date = {
      start: new Date(),
      end: new Date(moment().add(1, 'months').format(config.get('dateAdapter').get('dayFormat')))
    };

    calendar.deleteEvents(calendarId, date).then((flag) => {
      done();
    });
  });

  beforeEach("Recovery the app configuration.", () => {
    config.suggester.maxDays = maxDays;
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

      const maxSuggestions = config.get('suggester').get('maxSuggestions');

      this.assistant.suggest(sample, assertThatSuccessWith(done, (response) => {
        expect(response).to.have.lengthOf(maxSuggestions);
      }));
    });

    it("whether the number of returned suggestions is 0 when the configuration property maxDays=0.", (done) => {
      const sample = samples.getSampleWithValidRequest();

      config.suggester.maxDays = 0;

      this.assistant.suggest(sample, assertThatSuccessWith(done, (response) => {
        expect(response).to.have.lengthOf(config.get('suggester').get('maxDays'));
      }));
    });
  });

  after("Clean up", () => {
    mongoose.connection.close();
  });
});
