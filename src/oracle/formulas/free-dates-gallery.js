'use strict';

const DatesGallery = require('../../messenger/templates').DatesGallery;
const TextReply = require('@fanatic/messenger').templates.TextReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      let context = this.prophecy.context;

      R.when(context.suggestion_step && context.suggestions);
    },
    consequence: function(R) {
      const context = this.prophecy.context;

      const textReply = new TextReply(
        this.prophecy.recipientId,
        "Първите свободни дни, в които можете да посетите кабинета."
      );
      const suggestions = new DatesGallery(
        this.prophecy.recipientId,
        context.suggestions
      );

      this.replies = [textReply, suggestions];

      R.stop();
    }
  }
}
