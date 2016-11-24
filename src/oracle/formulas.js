'use strict';

const {
  TypingReply,
  QuickReply,
  CustomReply,
  ListReply,
  GalleryReply,
  TextReply
} = require('../../library/messenger/templates');

const {
  PickerReply,
  SuggestionReply
} = require('../messenger/templates');

const Employee = require('../models/Employee');
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
  //       const reply = new SuggestionReply(
  //         this.prophecy.getRecipientId(),
  //         'Свободни часове',
  //         '',
  //         'http://yonov.eu/wp-content/uploads/2016/08/DSCN1465-1.jpg',
  //         ['11/12/2016 16:00', '11/12/2016 16:00']
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
        const dayPickerConfig = config.get('messenger_templates').get('picker').get('day');

        const reply = new PickerReply(
          this.prophecy.getRecipientId(),
          dayPickerConfig.get('button').get('text'),
          this.prophecy.getMessage(),
          dayPickerConfig.get('webview')
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

        R.when(context.missing_hour);
    },
    consequence: function(R) {
        const timePickerConfig = config.get('messenger_templates').get('picker').get('time');

        const reply = new PickerReply(
          this.prophecy.getRecipientId(),
          timePickerConfig.get('button').get('text'),
          this.prophecy.getMessage(),
          timePickerConfig.get('webview')
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
    name: 'When a bot books time for a dentist.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.dentist && context.reason && context.hour && context.day && context.validated);
    },
    consequence: function(R) {
      this.templates = [];
      let context = this.prophecy.getContext();

      const reply = new CustomReply(
        this.prophecy.getRecipientId(),
        "Записан час",
        this.prophecy.getReplies(),
        context.dentist.pictureUrl,
        this.prophecy.getMessage()
      );

      this.templates.push({
        method: 'POST',
        reply: reply.getTemplate()
      });

      R.stop();
    }
  },
  {
    name: 'When a bot suggests free dates.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.suggestions);
    },
    consequence: function(R) {
      const suggestionsConfig = config.get('messenger_templates').get('suggestions');

      this.templates = [];
      let context = this.prophecy.getContext();

      const reply = new SuggestionReply(
        this.prophecy.getRecipientId(),
        suggestionsConfig.get('title'),
        suggestionsConfig.get('description'),
        context.dentist.pictureUrl,
        suggestionsConfig.get('button').get('text'),
        context.suggestions
      );

      this.templates.push({
        method: 'POST',
        reply: reply.getTemplate()
      });

      R.stop();
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
