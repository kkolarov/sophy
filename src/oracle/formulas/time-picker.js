'use strict';

const config = require('config');

const ButtonReply = require('@fanatic/messenger').templates.ButtonReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
        let context = this.prophecy.context;

        R.when(context.hour_step && !context.hour);
    },
    consequence: function(R) {
      const configuration = config.get('messenger_templates').get('picker').get('time');

      const buttons = [configuration.button];
      
      const picker = new ButtonReply(
        this.prophecy.recipientId,
        this.prophecy.message,
        buttons
      );

      this.replies = [picker];

      R.stop();
    }
  }
}
