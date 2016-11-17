'use strict';

/**
*
* @author Kamen Kolarov
*/
class BusyTimeException extends Error {

  constructor(message = 'Your preferred day + time has been booked yet') {
    super(message);
  }
}

module.exports = BusyTimeException;
