'use strict';

const config = require('config');

const Card = require('../../messenger/templates').Card;

const { TextReply, ImageReply } = require('@fanatic/messenger').templates;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.context;

      R.when(context.dentist && context.reason && context.day && context.hour);
    },
    consequence: function(R) {
      const configuration = config.messenger_templates.reservation;

      const buttons = [configuration.button];

      const card = new Card(
        this.prophecy.recipientId,
        configuration.title,
        buttons,
        configuration.imageUrl,
        this.prophecy.message
      )

      this.replies = [card];

      R.stop();
    }
  }
}
