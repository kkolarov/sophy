'use strict';

const config = require('config');

const Picker = require('../../messenger/templates').Picker;
const ButtonReply = require('@fanatic/messenger').templates.ButtonReply;

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        const context = this.prophecy.context;

        R.when(context.day_step && !context.day);
      },
      consequence: function(R) {
        const dayConfiguration = config.messengerTemplates.pickers.day;

        const dayPicker = new Picker(
          this.prophecy.recipientId,
          dayConfiguration.title,
          dayConfiguration.imageUrl,
          this.prophecy.message,
          [dayConfiguration.button]
        );

        const message = `Ако не можете да намерите свободен ден за ${this.prophecy.context.hour}, променете часа.`;
        const buttons = [config.messengerTemplates.pickers.updateTime.button];

        const timePicker = new ButtonReply(this.prophecy.recipientId, message, buttons);

        this.replies = [dayPicker, timePicker];

        logger.debug('The formula that provides a day picker has been executed.');

        R.stop();
      }
    }
  }
}
