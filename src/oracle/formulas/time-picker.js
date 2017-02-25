'use strict';

const config = require('config');

const ButtonReply = require('@fanatic/messenger/templates/ButtonReply');

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        const context = this.prophecy.context;

        R.when(context.hour_step && !context.hour);
      },
      consequence: function(R) {
        const configuration = config.messengerTemplates.pickers.addTime;

        const buttons = [configuration.button];

        const picker = new ButtonReply(
          this.prophecy.recipientId,
          this.prophecy.message,
          buttons
        );

        this.replies = [picker];

        logger.debug('The formula that provides a time picker has been executed.')

        R.stop();
      }
    }
  }
}
