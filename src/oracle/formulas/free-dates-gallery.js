'use strict';

const DatesGallery = require('../../messenger/templates').DatesGallery;

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

      const suggestions = new DatesGallery(
        this.prophecy.getRecipientId(),
        context.suggestions
      );

      this.replies = [suggestions];

      R.stop();
    }
  }
}
