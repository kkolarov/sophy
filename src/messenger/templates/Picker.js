'use strict';

const Card = require('./Card');

/**
*
* @author Kamen Kolarov
*/
class Picker extends Card {

  constructor(recipientId, message, imageUrl, description, buttons) {
    super(recipientId, message, imageUrl, description, buttons);
  }
}

module.exports = Picker;
