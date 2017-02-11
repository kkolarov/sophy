'use strict';

const config = require('config');

const Card = require('../../messenger/templates/Card');

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        const context = this.prophecy.context;

        R.when(context.dentist && context.reason && context.day && context.hour);
      },
      consequence: function(R) {
        const configuration = config.messengerTemplates.reservation;

        const buttons = [configuration.button];

        const card = new Card(
          this.prophecy.recipientId,
          configuration.title,
          configuration.imageUrl,
          this.prophecy.message,
          buttons
        )

        this.replies = [card];

        logger.debug('The formula that informs a user for successful reservation has been executed.')

        R.stop();
      }
    }
  }
}
