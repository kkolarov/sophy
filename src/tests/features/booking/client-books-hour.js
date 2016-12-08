'use strict';

const config = require('config');

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

describe("A client reserves time in a dentist's calendar", () => {

  before("Setup", (done) => {
    const that = this;

    mongoose.connect('mongodb://localhost/sophy-testing', (err) => {
      if (!err) {
        const Employee = require('../../../models/Employee');

        that.calendar = new GoogleCalendar(
          config.get('googleAppClientId'),
          config.get('googleAppClientSecret'),
          config.get('googleAppAuthURI')
        );

        that.calendar.setToken(
          config
          .get('googleApp')
          .get('users')
          .get('kamen_kolarov')
        );

        that.assistant = new BookingAssistant(Employee, this.calendar);

        done();
      }
    });
  });

  beforeEach("Clear up calendar's events.", (done) => {
    const calendarId = config.get('calendar').get('id');
    const date = {
      start: new Date(),
      end: new Date(moment().add(1, 'months').format(config.get('dateAdapter').get('dayFormat')))
    };

    this.calendar.deleteEvents(calendarId, date).then((flag) => {
      done();
    });
  });

  context("given that a request is invalid because", () => {
    it("the day doesn't comply with the appropriate format.", (done) => {
      const sample = samples.getSampleWithInvalidDay();

      this.assistant.book(sample, assertThatFailWith(done, exception => {
        expect(exception).instanceof(InvalidDayFormatError);
      }));
    });

    it("the hour doesn't comply with the appropriate format.", (done) => {
      const sample = samples.getSampleWithInvalidHour();

      this.assistant.book(sample, assertThatFailWith(done, exception => {
        expect(exception).instanceof(InvalidHourFormatError);
      }));
    });

    it("the date is expired.", (done) => {
      const sample = samples.getSampleWithRequestResidesInPast();

      this.assistant.book(sample, assertThatFailWith(done, exception => {
        expect(exception).instanceof(ExpiredDateError);
      }));
    });

    it("the date is reserved by someone else.", (done) => {
      const sample = samples.getSampleWithReservedHour();

      this.assistant.book(sample, (exception, event) => {
        if (!exception) {
          this.assistant.book(sample, assertThatFailWith(done, exception2 => {
            expect(exception2).instanceof(BusyTimeError);
          }));
        } else {
          done(exception);
        }
      });
    });

    it("the date resides in the outside working time.", (done) => {
      const sample = samples.getSampleWithRequestResidesOutsideWorkingTime();

      this.assistant.book(sample, assertThatFailWith(done, exception => {
        expect(exception).instanceof(OutsideWorkingTimeError);
      }));
    });
  });


  it("given that a request is valid", (done) => {
    const sample = samples.getSampleWithValidRequest();

    this.assistant.book(sample, assertThatSuccessWith(done, (response) => {
      expect(response).to.have.property('id');
    }));
  });

  after("Clean up", () => {
    mongoose.connection.close();
  });
});
