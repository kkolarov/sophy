'use strict';

/**
*
* @author Kamen Kolarov
*/
class InvalidHourFormatError extends Error {

  constructor(message = 'The hour format is invalid.') {
    super(message);
  }
}

module.exports = InvalidHourFormatError;
