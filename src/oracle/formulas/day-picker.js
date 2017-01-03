'use strict';

const config = require('config');

const Picker = require('../../messenger/templates').Picker;
const TextReply = require('@fanatic/messenger').templates.TextReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.context;

      R.when(context.day_step && !context.day);
    },
    consequence: function(R) {
      const configuration = config.get('messenger_templates').get('picker').get('day');

      const textReply = new TextReply(
        this.prophecy.recipientId,
        this.prophecy.message
      );

      const picker = new Picker(
        this.prophecy.recipientId,
        configuration.title,
        configuration.description,
        configuration.imageUrl,
        configuration.webview.url,
        configuration.button.text,
        configuration.webview.screen
      );

      this.replies = [textReply, picker];

      R.stop();
    }
  }
}
