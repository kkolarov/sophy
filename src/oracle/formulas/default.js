'use strict';

const QuickReply = require('@fanatic/messenger').templates.QuickReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
        R.when(true);
    },
    consequence: function(R) {
      const context = this.prophecy.context;

      const quickReply = new QuickReply(
        this.prophecy.recipientId,
        this.prophecy.message,
        this.prophecy.quickReplies
      );

      this.replies = [quickReply];

      R.stop();
    }
  }
}
