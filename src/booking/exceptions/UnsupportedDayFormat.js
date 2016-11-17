'use strict';

/**
*
* @author Kamen Kolarov
*/
class UnsupportedDayFormat extends Error {

  constructor(message = 'Unsupported day format') {
    super(message);
  }
}

module.exports = UnsupportedDayFormat;
