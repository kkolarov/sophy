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
} = require('@fanatic/reservation').errors;

const { assertThatSuccessWith, assertThatFailWith } = require('../../assertion');

const Assistant = require('@fanatic/reservation').Assistant;
const { GoogleCalendar } = require('@fanatic/reservation').calendars;

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

        that.assistant = new Assistant(Employee, this.calendar);

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
