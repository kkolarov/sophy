'use strict';

const TextReply = require('@fanatic/messenger').templates.TextReply;
const DentistsGallery = require('../../messenger/templates').DentistsGallery;

const Employee = require('../../models/Employee');

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.context;

      R.when(context.dentist_step);
    },
    consequence: function(R) {
      const context = this.prophecy.context;
      const position = 'dentist';
      const size = 10;

      Employee.findEmployees(position, size)
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

          R.stop();
        });
    }
  }
}
