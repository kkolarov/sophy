'use strict';

const config = require('config');
const Picker = require('../../messenger/templates').Picker;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
        let context = this.prophecy.context;

        R.when(context.hour_step && !context.hour);
    },
    consequence: function(R) {
      let configuration = config.get('messenger_templates').get('picker').get('time');

      const picker = new Picker(
        this.prophecy.recipientId,
        configuration.get('title'),
        configuration.get('description'),
        configuration.get('imageUrl'),
        configuration.get('webview').get('url'),
        configuration.get('button').get('text'),
        configuration.get('webview').get('screen')
      );

      this.replies = [picker];

      R.stop();
    }
  }
}
