'use strict';

const config = require('config');

const { GoogleCalendar } = require('./calendars/google-calendar');
const { HourAlgorithm, TimeAlgorithm } = require('./checker/algorithms');
const Scheduler = require('./Scheduler');
const Checker = require('./checker').Checker;
const { DateAdapter, DateValidator } = require('./date');
const Suggester = require('./Suggester');

/**
* This module gives simpler interface for reserving day & hour in a calendar.
*
* @author Kamen Kolarov
*/
class BookingAssistant {

  constructor(model, calendar = null) {
    this._model = model;
    this._calendar = calendar;

    if (!this._calendar) {
      this._calendar = new GoogleCalendar(
        config.get('googleAppClientId'),
        config.get('googleAppClientSecret'),
        config.get('googleAppAuthURI')
      );

      this._calendar.setToken(
        config
        .get('googleApp')
        .get('users')
        .get('kamen_kolarov')
      );
    }

    const adapter = new DateAdapter(
      config.get('dateAdapter').get('dayFormat'),
      config.get('dateAdapter').get('dateFormat')
    );
    const validator = new DateValidator();

    const algorithms = [
      new HourAlgorithm(this._calendar, this._model , adapter, validator),
      new TimeAlgorithm(this._calendar, this._model, adapter, validator)
    ];

    let checker = new Checker(algorithms);

    this._scheduler = new Scheduler(this._calendar, checker);
    this._suggester = new Suggester(checker, adapter);
  }

  /**
  * This method checks the request validity based on the business rules.
  * Rule 1: A client's request for day & hour mustn't be reserved by someone else.
  * Rule 2: A client's request for day & hour mustn't reside in the past.
  * Rule 3: A client's request for day & hour must be in the specified working time.
  *
  * @param JSON req
  * @param Callback cb
  *
  * @return Callback cb
  */
  validate(req, cb) {
    this._scheduler.isApproved(req, cb);
  }

  /**
  * This method suggests free dates according to a client's request for day & hour.
  *
  * @param JSON req
  * @param Callback cb
  *
  * @return Callback cb
  */
  suggest(req, cb) {
    this._suggester.suggest(req, cb);
  }

  /**
  * This method adds a client's request for day & hour in a calendar.
  *
  * @param JSON req
  * @param Callback cb
  *
  * @return Callback cb
  */
  book(req, cb) {
    this.validate(req, (err, date) => {
      if (!err) {
        this._scheduler.schedule(req.calendarId, req.sender, req.description, date, cb);
      } else {
          cb(err, null);
      }
    });
  }
}

module.exports = BookingAssistant;
