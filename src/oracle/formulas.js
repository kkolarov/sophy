'use strict';

const {
  TypingReply,
  QuickReply,
  Card,
  ListReply,
  Gallery,
  TextReply,
  Picker,
  Suggestions,
  DentistSuggestion
} = require('../messenger/templates');

const Employee = require('../models/Employee');
const config = require('config');

module.exports = [
  {
    name: "When the bot process a client's response",
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.thinking);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const typingReply = new TypingReply(
        this.prophecy.getRecipientId(),
        context.thinking ? 'typing_on' : 'typing_off'
      );

      this.replies = [typingReply];

      R.stop();
    }
  },
  {
    name: "When the bot reports that the dentist specified by a client hasn't been found.",
    condition: function(R) {
      const context = this.prophecy.getContext();

      R.when(context.dentist_step && context.unknown_dentist);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const textReply = new TextReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage()
      );

      this.replies = [textReply];

      R.stop();
    }
  },
  {
    name: "When the bot suggests a collection of dentists.",
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

          // const typingReply = new TypingReply(
          //   this.prophecy.getRecipientId(),
          //   'typing_on'
          // );

          const suggestions = new DentistSuggestion(
            this.prophecy.getRecipientId(),
            employees
          );

          this.replies = [textReply, suggestions];

          R.stop();
        });
    }
  },
  {
    name: "When the bot asks for a reason about client's complaints.",
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

      // const typingReply = new TypingReply(
      //   this.prophecy.getRecipientId(),
      //   'typing_on'
      // );

      const gallery = new Gallery(
        this.prophecy.getRecipientId(),
        config.get('reasons')
      );

      this.replies = [textReply, gallery];

      R.stop();
    }
  },
  {
    name: 'When the bot gives a time picker to a client.',
    condition: function(R) {
        let context = this.prophecy.getContext();

        R.when(context.hour_step && !context.hour);
    },
    consequence: function(R) {
        const timePickerConfig = config.get('messenger_templates').get('picker').get('time');

        const picker = new Picker(
          this.prophecy.getRecipientId(),
          timePickerConfig.get('button').get('text'),
          this.prophecy.getMessage(),
          timePickerConfig.get('webview')
        );

        this.replies = [picker];

        R.stop();
    }
  },
  {
    name: 'When the bot asks for confirmation about the selected hour.',
    condition: function(R) {
        let context = this.prophecy.getContext();

        R.when(context.hour_step && context.hour);
    },
    consequence: function(R) {
        const quickReply = new QuickReply(
          this.prophecy.getRecipientId(),
          this.prophecy.getMessage(),
          this.prophecy.getReplies()
        );

        this.replies = [quickReply];

        R.stop();
    }
  },
  {
    name: 'When the bot asks a client to wait for suggestions.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.suggestion_step && !context.suggestions);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const textReply = new TextReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage()
      );

      const typingReply = new TypingReply(
        this.prophecy.getRecipientId(),
        'typing_on'
      );

      this.replies = [textReply, typingReply];

      R.stop();
    }
  },
  {
    name: 'When the bot suggests free dates.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.suggestion_step && context.suggestions);
    },
    consequence: function(R) {
      const suggestionsConfig = config.get('messenger_templates').get('suggestions');

      const context = this.prophecy.getContext();

      const suggestions = new Suggestions(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage(),
        suggestionsConfig.get('description'),
        context.dentist.pictureUrl,
        suggestionsConfig.get('button').get('text'),
        context.suggestions
      );

      this.replies = [suggestions];

      R.stop();
    }
  },
  {
    name: "When the bot books an appointment in a dentist's calendar",
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.dentist && context.reason && context.day && context.hour);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      const card = new Card(
        this.prophecy.getRecipientId(),
        "Записан час",
        this.prophecy.getReplies(),
        context.dentist.pictureUrl,
        this.prophecy.getMessage()
      );

      this.replies = [card];

      R.stop();
    }
  },
  {
    name: 'When there is no matching rule.',
    condition: function(R) {
        R.when(true);
    },
    consequence: function(R) {
      const context = this.prophecy.getContext();

      const quickReply = new QuickReply(
        this.prophecy.getRecipientId(),
        this.prophecy.getMessage(),
        this.prophecy.getReplies()
      );

      this.replies = [quickReply];

      R.stop();
    }
  }
];
