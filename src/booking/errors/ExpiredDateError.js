'use strict';

/**
*
* @author Kamen Kolarov
*/
class ExpiredDateError extends Error {

  constructor(message = 'The date is expired.') {
    super(message);
  }
}

module.exports = ExpiredDateError;
