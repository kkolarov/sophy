'use strict';

const config = require('config');
const Picker = require('../../messenger/templates').Picker;

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
        let context = this.prophecy.context;

        R.when(true);
    },
    consequence: function(R) {
      let configuration1 = config.get('messenger_templates').get('picker').get('time');
      let configuration2 = config.get('messenger_templates').get('picker').get('day');

      const picker1 = new Picker(
        this.prophecy.recipientId,
        configuration1.get('title'),
        configuration1.get('description'),
        configuration1.get('imageUrl'),
        configuration1.get('webview').get('url'),
        configuration1.get('button').get('text'),
        configuration1.get('screen').get('size')
      );

      const picker2 = new Picker(
        this.prophecy.recipientId,
        configuration2.get('title'),
        configuration2.get('description'),
        configuration2.get('imageUrl'),
        configuration2.get('webview').get('url'),
        configuration2.get('button').get('text'),
        configuration2.get('screen').get('size')
      );

      this.replies = [picker1, picker2];

      R.stop();
    }
  }
}
