'use strict';

const Card = require('../../messenger/templates').Card;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.getContext();

      R.when(context.dentist && context.reason && context.day && context.hour);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const card = new Card(
        this.prophecy.getRecipientId(),
        "Записан час",
        this.prophecy.getReplies(),
        context.dentist.pictureUrl,
        this.prophecy.getMessage()
      );

      this.replies = [card];

      R.stop();
    }
  }
}
