'use strict';

const config = require('config');

const Picker = require('../../messenger/templates').Picker;
const ButtonReply = require('@fanatic/messenger').templates.ButtonReply;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.context;

      R.when(context.day_step && !context.day);
    },
    consequence: function(R) {
      const configuration = config.messenger_templates.picker.calendar;

      const dayPicker = new Picker(
        this.prophecy.recipientId,
        configuration.day.title,
        this.prophecy.message,
        configuration.day.imageUrl,
        configuration.day.button.url,
        configuration.day.button.text,
        configuration.day.button.webview_height_ratio
      );

      const message = `Ако не можете да намерите свободен ден за ${this.prophecy.context.hour}, променете часа.`;
      const buttons = [configuration.time.button];

      const timePicker  = new ButtonReply(
        this.prophecy.recipientId,
        message,
        buttons
      );

      this.replies = [dayPicker, timePicker];

      R.stop();
    }
  }
}
