'use strict';

const DatesGallery = require('../../messenger/templates').DatesGallery;
const TextReply = require('@fanatic/messenger').templates.TextReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.suggestion_step && context.suggestions);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const textReply = new TextReply(
        this.prophecy.getRecipientId(),
        "Първите свободни дни, в които можете да посетите кабинета."
      );
      const suggestions = new DatesGallery(
        this.prophecy.getRecipientId(),
        context.suggestions
      );

      this.replies = [textReply, suggestions];

      R.stop();
    }
  }
}
