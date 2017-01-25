'use strict';

const TextReply = require('@fanatic/messenger').templates.TextReply;
const DentistsGallery = require('../../messenger/templates').DentistsGallery;

const Employee = require('../../models/Employee');

module.exports = (manager, logger) => {
  return ({ name, priority }) => {
    return {
      name: name,
      priority: priority,
      condition: function(R) {
        const context = this.prophecy.context;

        R.when(context.dentist_step);
      },
      consequence: function(R) {
        const context = this.prophecy.context;

        manager.findConversationByUserId(context.recipient.id)
          .then(conversation => {
            const size = 10;
            const page = conversation.metadata.page;

            Employee.findEmployeesByBusinessId(page._business, size)
              .then(employees => {
                const textReply = new TextReply(
                  this.prophecy.recipientId,
                  this.prophecy.message
                );

                const suggestions = new DentistsGallery(
                  this.prophecy.recipientId,
                  employees
                );

                this.replies = [textReply, suggestions];

                logger.debug('The formula that provides a gallery of dentists has been executed.');

                R.stop();
              });
            }).catch(err => {
              //TODO: The error message has to be logged into a this object.
              console.log(err);
            });
      }
    }
  }
}
