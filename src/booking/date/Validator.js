'use strict';

const moment = require('moment');

const { InvalidDayFormatError, InvalidHourFormatError} = require('../errors');

/**
*
* @author Kamen Kolarov
*/
class Validator {

  constructor() {

  }

  /**
  *
  * @param String date
  *
  * @return Boolean
  */
  _checkDate(date) {
    let timestamp = Date.parse(date)
    return isNaN(timestamp) ? false : true;
  }

  /**
  * This method validates the date format.
  *
  * @param String day
  * @param String hour
  * @param Callback cb
  *
  * @return Callback
  */
  validate(day, hour, cb) {
    if (this._checkDate(day)) {
      let date = `${day}, ${hour}`;

      if (this._checkDate(date)) {
        cb(null, true);
      } else {
        cb(new InvalidHourFormatError(), null);
      }
    } else {
      cb(new InvalidDayFormatError(), null);
    }
  }
}

module.exports = Validator;
