'use strict';

const { TextReply, DentistsGallery } = require('../../messenger/templates');

const Employee = require('../../models/Employee');

module.exports = ({ name, priority }) => {
  return {
    name: name,
    priority: priority,
    condition: function(R) {
      const context = this.prophecy.getContext();

      R.when(context.dentist_step);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();
      const position = 'dentist';
      const size = 10;

      Employee.findEmployees(position, size)
        .then(employees => {
          const textReply = new TextReply(
            this.prophecy.getRecipientId(),
            this.prophecy.getMessage()
          );

          const suggestions = new DentistsGallery(
            this.prophecy.getRecipientId(),
            employees
          );

          this.replies = [textReply, suggestions];

          R.stop();
        });
    }
  }
}
