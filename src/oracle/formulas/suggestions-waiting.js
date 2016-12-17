'use strict';

const TextReply = require('@fanatic/messenger').templates.TextReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.context;

      R.when(context.suggestion_step && !context.suggestions);
    },
    consequence: function(R) {
      const context = this.prophecy.context;

      const textReply = new TextReply(
        this.prophecy.recipientId,
        this.prophecy.message
      );

      this.replies = [textReply];

      R.stop();
    }
  }
}
