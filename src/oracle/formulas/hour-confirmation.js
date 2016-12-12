'use strict';

const QuickReply = require('@fanatic/messenger').templates.QuickReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
        let context = this.prophecy.getContext();

        R.when(context.hour_step && context.hour);
    },
    consequence: function(R) {
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
