'use strict';

const { TypingReply, QuickReply, CustomReply } = require('../library/messenger/templates');

const Employee = require('./models/Employee');

module.exports = [
  {
    name: "When the bot process a client' response",
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.thinking);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      this.method = 'POST';
      this.reply = new TypingReply(
        this.prophecy.getRecipientId(),
        context.thinking ? 'typing_on' : 'typing_off'
      );
      this.template = this.reply.getTemplate();
      R.stop();
    }
  },
  {
    name: 'When a dentist property exists.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.dentist);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      Employee.findEmployeeByName(context.dentist, (err, employee) => {
        if (!err && employee) {
          this.method = 'POST';
          this.employee = employee;
          this.reply = new CustomReply(
            this.prophecy.getRecipientId(),
            this.prophecy.getMessage(),
            this.prophecy.getReplies(),
            employee.pictureUrl
          );
          this.template = this.reply.getTemplate();

          R.stop();
        }
      });
    }
  },
  {
    name: 'When there is no matching rule.',
    condition: function(R) {
        R.when(true);
    },
    consequence: function(R) {
        this.method = 'POST';
        this.reply = new QuickReply(
          this.prophecy.getRecipientId(),
          this.prophecy.getMessage(),
          this.prophecy.getReplies()
        );
        this.template = this.reply.getTemplate();

        R.stop();
    }
  }
];
