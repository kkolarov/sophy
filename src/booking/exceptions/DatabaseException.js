'use strict';

/**
*
* @author Kamen Kolarov
*/
class DatabaseException extends Error {

  constructor(message = '') {
    super(message);
  }
}

module.exports = DatabaseException;
