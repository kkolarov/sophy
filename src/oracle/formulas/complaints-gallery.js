'use strict';

const config = require('config');

const TextReply = require('@fanatic/messenger').templates.TextReply;
const ReasonsGallery = require('../../messenger/templates').ReasonsGallery;

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        const context = this.prophecy.context;

        R.when(context.reason_step);
      },
      consequence: function(R) {
        const context = this.prophecy.context;

        const textReply = new TextReply(
          this.prophecy.recipientId,
          this.prophecy.message
        );

        const gallery = new ReasonsGallery(
          this.prophecy.recipientId,
          config.get('messenger_templates').get('reasons')
        );

        this.replies = [textReply, gallery];

        logger.debug('The formula that provides a gallery of complaints has been executed.')

        R.stop();
      }
    }
  }
}
