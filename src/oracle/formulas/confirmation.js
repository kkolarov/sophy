'use strict';

const QuickReply = require('@fanatic/messenger/templates/QuickReply');

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        const context = this.prophecy.context;

        R.when((context.hour_step && context.hour) || (context.day_step && context.day));
      },
      consequence: function(R) {
          const quickReply = new QuickReply(
            this.prophecy.recipientId,
            this.prophecy.message,
            this.prophecy.quickReplies
          );

          this.replies = [quickReply];

          logger.debug('The formula that ask a user for confirmation has been executed.')

          R.stop();
      }
    }
  }
}
