'use strict';

const Card = require('../../messenger/templates').Card;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.context;

      R.when(context.dentist && context.reason && context.day && context.hour);
    },
    consequence: function(R) {
      const context = this.prophecy.context;

      const card = new Card(
        this.prophecy.recipientId,
        "Записан час",
        [],
        "https://dl.dropboxusercontent.com/u/108059564/reservation.jpg",
        this.prophecy.message
      );

      this.replies = [card];

      R.stop();
    }
  }
}
