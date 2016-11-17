'use strict';

/**
*
* @author Kamen Kolarov
*/
class OutsideWorkingTimeException extends Error {

  constructor(message = 'Your preferred day + time is beyound specified working time') {
    super(message);
  }
}

module.exports = OutsideWorkingTimeException;
