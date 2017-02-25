'use strict';

const config = require('config');

const TextReply = require('@fanatic/messenger/templates/TextReply');
const ReasonGallery = require('../../messenger/templates/ReasonGallery');

module.exports = (logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        R.when(this.prophecy.context.reason_step);
      },
      consequence: function(R) {
        const context = this.prophecy.context;

        const textReply = new TextReply(
          this.prophecy.recipientId,
          this.prophecy.message
        );

        const reasons = config.messengerTemplates.reasons;

        for (let reason of reasons) {
          if (reason.title == config.prophecyIntepreter.reasonGallery.callCard.title) {
            if (context.hasOwnProperty('dentist') && context.dentist.phoneNumber) {
              reason.buttons[0].payload = context.dentist.phoneNumber;
            } else {
              this.err = new Error("The employee's phone number hasn't been found.");
              R.stop();

              break;
            }
          }
        }

        const gallery = new ReasonGallery(
          this.prophecy.recipientId,
          reasons
        );

        this.replies = [textReply, gallery];

        logger.debug('The formula that provides a gallery of complaints has been executed.')

        R.stop();
      }
    }
  }
}
