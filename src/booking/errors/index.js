'use strict';

const BusyTimeError = require('./BusyTimeError');
const OutsideWorkingTimeError = require('./OutsideWorkingTimeError');
const ExpiredDateError = require('./ExpiredDateError');
const InvalidDayFormatError = require('./InvalidDayFormatError');
const InvalidHourFormatError = require('./InvalidHourFormatError');

module.exports = {
  BusyTimeError: BusyTimeError,
  OutsideWorkingTimeError: OutsideWorkingTimeError,
  ExpiredDateError: ExpiredDateError,
  InvalidDayFormatError: InvalidDayFormatError,
  InvalidHourFormatError: InvalidHourFormatError
};
