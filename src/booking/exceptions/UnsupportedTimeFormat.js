'use strict';

/**
*
* @author Kamen Kolarov
*/
class UnsupportedTimeFormat extends Error {

  constructor(message = 'Unsupported time format') {
    super(message);
  }
}

module.exports = UnsupportedTimeFormat;
