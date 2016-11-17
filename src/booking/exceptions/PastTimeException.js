'use strict';

/**
*
* @author Kamen Kolarov
*/
class PastTimeException extends Error {

  constructor(message = 'You cannot book time in the past') {
    super(message);
  }
}

module.exports = PastTimeException;
