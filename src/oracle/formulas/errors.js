'use strict';

const TextReply = require('@fanatic/messenger/templates/TextReply');

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        const context = this.prophecy.context;

        R.when(context.busy_time_error ||
          context.outside_working_time_error ||
          context.expired_date_error);
      },
      consequence: function(R) {
        const context = this.prophecy.context;

        const textReply = new TextReply(
          this.prophecy.recipientId,
          this.prophecy.message
        );

        this.replies = [textReply];

        logger.debug('The formula that handles errors thrown by the Assistant has been executed.');

        R.stop();
      }
    }
  }
}
