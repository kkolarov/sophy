'use strict';

const BusyTimeException = require('./BusyTimeException');
const OutsideWorkingTimeException = require('./OutsideWorkingTimeException');
const PastTimeException = require('./PastTimeException');
const DatabaseException = require('./DatabaseException');
const CustomerNotFoundException = require('./CustomerNotFoundException');
const UnsupportedDayFormat = require('./UnsupportedDayFormat');
const UnsupportedTimeFormat = require('./UnsupportedTimeFormat');

module.exports = {
  BusyTimeException: BusyTimeException,
  OutsideWorkingTimeException: OutsideWorkingTimeException,
  PastTimeException: PastTimeException,
  DatabaseException: DatabaseException,
  CustomerNotFoundException: CustomerNotFoundException,
  UnsupportedDayFormat: UnsupportedDayFormat,
  UnsupportedTimeFormat: UnsupportedTimeFormat
};
