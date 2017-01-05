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

      // TODO: This requirement for template is temporarily postponed.

      // const imageReply = new ImageReply(
      //   this.prophecy.recipientId,
      //   configuration.imageUrl
      // );
      //
      // const textReply = new TextReply(
      //   this.prophecy.recipientId,
      //   this.prophecy.message
      // );

      const card = new Card(
        this.prophecy.recipientId,
        configuration.title,
        configuration.replies,
        configuration.imageUrl,
        this.prophecy.message
      )

      this.replies = [card];

      R.stop();
    }
  }
}
