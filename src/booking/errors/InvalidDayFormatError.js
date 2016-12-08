'use strict';

/**
*
* @author Kamen Kolarov
*/
class InvalidDayFormatError extends Error {

  constructor(message = 'The day format is invalid.') {
    super(message);
  }
}

module.exports = InvalidDayFormatError;
