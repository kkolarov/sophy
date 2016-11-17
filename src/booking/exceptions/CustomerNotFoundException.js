'use strict';

/**
*
* @author Kamen Kolarov
*/
class CustomerNotFoundException extends Error {

  constructor(message = '') {
    super(message);
  }
}

module.exports = CustomerNotFoundException;
