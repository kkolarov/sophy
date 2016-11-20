'use strict';

const moment = require('moment-business-days');

const {
  OutsideWorkingTimeException,
  PastTimeException,
  DatabaseException,
  CustomerNotFoundException
} = require('../../exceptions');

/**
* An abstract algorithm that checks whether client's request is already reserved or not.
*
* @author Kamen Kolarov
*/
class Algorithm {

  /**
  *
  * @param Object calendar This module gives a way of manipulating a calendar.
  * @param Object model This module provides an abstract model of a calendar owner.
  * @param Object adapter This module adaptes client's request for day & hour.
  * @param Object validator This module validates the date format.
  */
  constructor(calendar, model, adapter, validator) {
    this._calendar = calendar;
    this._model = model;
    this._adapter = adapter;
    this._validator = validator;
  }

  /**
  * This method make sures a client's request for day & hour is not in the past.
  *
  * @param JSON date
  * @param Callback cb
  *
  * @return Callback cb
  */
  isUpcomingDate(date, cb) {
    let now = new Date();

    if (date.start >= now && date.end >= now) {
      cb(null, true);
    } else {
      cb(new PastTimeException(), null);
    }
  }

  /**
  * This method make sures a request falls into the working time.
  *
  * @param String calendarId
  * @param JSON date
  * @param String day
  * @param Callback cb
  *
  * @return Callback cb
  */
  checkWorkingTime(calendarId, date, day, cb) {
    let isBusinessDay = (day) => {
      return moment(day, this._adapter.getDateFormat()).isBusinessDay() ? true: false;
    }

    let stickToWorkingTime = (date, workingTime) => {
      if (date.start >= workingTime.start && date.end <= workingTime.end) {
        return true;
      } else {
        return false;
      }
    }

    let workWeekly = (employee) => {
      return employee.workingTime.weekly.active ? true : false;
    }

    let workHoliday = (employee) => {
      return employee.workingTime.holiday.active ? true : false;
    }

    this._model.findEmployeeByCalendarId(calendarId, (err, employee) => {
      if (!err) {
        if (employee) {
          let workingTime = {};

          if (isBusinessDay(day) && workWeekly(employee)) {
            workingTime = employee.workingTime.weekly;
          } else if (!isBusinessDay(day) && workHoliday(employee)) {
            workingTime = employee.workingTime.holiday;
          }

          workingTime = this._adapter.adaptWorkingTime(day, workingTime);
          if (stickToWorkingTime(date, workingTime)) {
            cb(null,  true);
          } else {
            cb(new OutsideWorkingTimeException(), null);
          }
        } else {
          cb(new CustomerNotFoundException(), null);
        }
      } else {
        cb(new DatabaseException(), null);
      }
    });
  }
}

module.exports = Algorithm;
