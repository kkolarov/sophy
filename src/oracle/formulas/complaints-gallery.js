'use strict';

const config = require('config');
const { TextReply, ReasonsGallery } = require('../../messenger/templates');

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.reason_step);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      const textReply = new TextReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage()
      );

      const gallery = new ReasonsGallery(
        this.prophecy.getRecipientId(),
        config.get('messenger_templates').get('reasons')
      );

      this.replies = [textReply, gallery];

      R.stop();
    }
  }
}
