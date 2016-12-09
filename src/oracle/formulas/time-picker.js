'use strict';

const config = require('config');
const Picker = require('../../messenger/templates').Picker;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
        let context = this.prophecy.getContext();

        R.when(context.hour_step && !context.hour);
    },
    consequence: function(R) {
        const timePickerConfig = config.get('messenger_templates').get('picker').get('time');


        const picker = new Picker(
          this.prophecy.getRecipientId(),
          timePickerConfig.get('button').get('text'),
          this.prophecy.getMessage(),
          timePickerConfig.get('webview')
        );

        this.replies = [picker];

        R.stop();
    }
  }
}
