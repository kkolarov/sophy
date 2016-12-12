'use strict';

const TypingReply = require('@fanatic/messenger').templates.TypingReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.thinking);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const typingReply = new TypingReply(
        this.prophecy.getRecipientId(),
        context.thinking ? 'typing_on' : 'typing_off'
      );

      this.replies = [typingReply];

      R.stop();
    }
  };
}
