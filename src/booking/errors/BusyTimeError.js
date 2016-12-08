'use strict';

/**
*
* @author Kamen Kolarov
*/
class BusyTimeError extends Error {

  constructor(message = 'The date have been reserved by someone else.') {
    super(message);
  }
}

module.exports = BusyTimeError;
