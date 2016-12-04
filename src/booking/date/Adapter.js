'use strict';

const moment = require('moment');
const _ = require('lodash');

/**
* This module adaptes client's request for day & hour.
*
* @author Kamen Kolarov
*/
class Adapter {

  constructor(dayFormat, dateFormat) {
    this._dayFormat = dayFormat;
    this._dateFormat = dateFormat;
  }

  /**
  *
  * @return String
  */
  getDayFormat() {
    return this._dayFormat;
  }

  /**
  *
  * @return String
  */
  getDateFormat() {
    return this._dateFormat;
  }

  /**
  *
  * @param String day
  * @param String hour
  * @param JSON duration
  *
  * @return JSON
  */
  adaptDuration(day, hour, duration) {
    let date = {};

    date.start = `${day}, ${hour}`;
    date.end = moment(`${day}, ${hour}`, this._dateFormat);

    _.forEach(duration, (value, key) => {
      date.end.add(value, key);
    });

    date.end = date.end.format();

    return { start: new Date(date.start), end: new Date(date.end) };
  }

  /**
  *
  * @param Strin day
  * @param JSON workingTime
  *
  * @return JSON
  */
  adaptWorkingTime(day, workingTime) {
    let date = {};

    date.start = `${day}, ${workingTime.start}`;
    date.end = `${day}, ${workingTime.end}`;

    return { start: new Date(date.start), end: new Date(date.end) };
  }
}

module.exports = Adapter;
