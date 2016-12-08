'use strict';

/**
*
* @author Kamen Kolarov
*/
class OutsideWorkingTimeError extends Error {

  constructor(message = 'The date resides the outside working time.') {
    super(message);
  }
}

module.exports = OutsideWorkingTimeError;
