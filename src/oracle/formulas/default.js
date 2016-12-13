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
      const context = this.prophecy.getContext();

      const quickReply = new QuickReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage(),
        this.prophecy.getReplies()
      );

      this.replies = [quickReply];

      R.stop();
    }
  }
}
