'use strict';

const TypingReply = require('@fanatic/messenger/templates/TypingReply');

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        R.when(this.prophecy.context.thinking);
      },
      consequence: function(R) {
        const context = this.prophecy.context;

        const typingReply = new TypingReply(
          this.prophecy.recipientId,
          context.thinking ? 'typing_on' : 'typing_off'
        );

        this.replies = [typingReply];

        logger.debug('The formula that informs a user for message processing has been executed.')

        R.stop();
      }
    };
  }
}
