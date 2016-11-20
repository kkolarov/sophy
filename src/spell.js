'use strict';

const {
  TypingReply,
  QuickReply,
  CustomReply,
  ListReply,
  GalleryReply,
  TextReply
} = require('../library/messenger/templates');

const {
  PickerReply,
} = require('./messenger/templates');

const Employee = require('./models/Employee');
const config = require('config');

module.exports = [
  // {
  //   name: 'When a bot gives the day picker to a client.',
  //   condition: function(R) {
  //       let context = this.prophecy.getContext();
  //
  //       R.when(true);
  //   },
  //   consequence: function(R) {
  //       const reply = new PickerReply(
  //         this.prophecy.getRecipientId(),
  //         this.prophecy.getMessage(),
  //         'https://c1827a08.ngrok.io/picker/day'
  //       );
  //
  //       this.templates = [];
  //       this.templates.push({
  //         method: 'POST',
  //         reply: reply.getTemplate()
  //       });
  //
  //       R.stop();
  //   }
  // },
  {
    name: "When a bot process the client's response",
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.thinking);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      const reply = new TypingReply(
        this.prophecy.getRecipientId(),
        context.thinking ? 'typing_on' : 'typing_off'
      );

      this.templates = [];
      this.templates.push({
        method: 'POST',
        reply: reply.getTemplate()
      });

      R.stop();
    }
  },
  {
    name: "When a bot suggests a collection of dentists.",
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.missing_dentist);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      const textReply = new TextReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage()
      );

      const galleryReply = new GalleryReply(
        this.prophecy.getRecipientId(),
        config.get('dentists')
      );

      this.templates = [];
      this.templates.push({
        method: 'POST',
        reply: textReply.getTemplate()
      });
      this.templates.push({
        method: 'POST',
        reply: galleryReply.getTemplate()
      });

      R.stop();
    }
  },
  {
    name: "When a bot asks for a reason about client's complaints.",
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.missing_reason);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      const textReply = new TextReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage()
      );

      const galleryReply = new GalleryReply(
        this.prophecy.getRecipientId(),
        config.get('reasons')
      );

      this.templates = [];
      this.templates.push({
        method: 'POST',
        reply: textReply.getTemplate()
      });
      this.templates.push({
        method: 'POST',
        reply: galleryReply.getTemplate()
      });

      R.stop();
    }
  },
  {
    name: 'When a bot gives the day picker to a client.',
    condition: function(R) {
        let context = this.prophecy.getContext();

        R.when(context.missing_day);
    },
    consequence: function(R) {
        const reply = new PickerReply(
          this.prophecy.getRecipientId(),
          this.prophecy.getMessage(),
          'https://c1827a08.ngrok.io/picker/day'
        );

        this.templates = [];
        this.templates.push({
          method: 'POST',
          reply: reply.getTemplate()
        });

        R.stop();
    }
  },
  {
    name: 'When a bot gives the time picker to a client.',
    condition: function(R) {
        let context = this.prophecy.getContext();

        R.when(context.missing_time && !context.time);
    },
    consequence: function(R) {
        const reply = new PickerReply(
          this.prophecy.getRecipientId(),
          this.prophecy.getMessage(),
          'https://c1827a08.ngrok.io/picker/time'
        );

        this.templates = [];
        this.templates.push({
          method: 'POST',
          reply: reply.getTemplate()
        });

        R.stop();
    }
  },
  {
    name: 'When a dentist property exists.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.dentist && context.reason && context.time && context.day);
    },
    consequence: function(R) {
      this.templates = [];
      let context = this.prophecy.getContext();

      Employee.findEmployeeByName(context.dentist, (err, employee) => {
        if (!err && employee) {

          const reply = new CustomReply(
            this.prophecy.getRecipientId(),
            "Записан час",
            this.prophecy.getReplies(),
            employee.pictureUrl,
            this.prophecy.getMessage()
          );

          this.templates.push({
            method: 'POST',
            reply: reply.getTemplate()
          });

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
        this.templates = [];

        const reply = new QuickReply(
          this.prophecy.getRecipientId(),
          this.prophecy.getMessage(),
          this.prophecy.getReplies()
        );

        this.templates.push({
          method: 'POST',
          reply: reply.getTemplate()
        });

        R.stop();
    }
  }
];
