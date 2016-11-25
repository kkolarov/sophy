'use strict';

const {
  TypingReply,
  QuickReply,
  Card,
  ListReply,
  Gallery,
  TextReply,
  Picker,
  Suggestions
} = require('../messenger/templates');

const Employee = require('../models/Employee');
const config = require('config');

module.exports = [
  {
    name: "When a bot process the client's response",
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.thinking);
    },
    consequence: function(R) {
      let context = this.prophecy.getContext();

      const typingReply = new TypingReply(
        this.prophecy.getRecipientId(),
        context.thinking ? 'typing_on' : 'typing_off'
      );

      this.replies = [typingReply];

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

      const gallery = new Gallery(
        this.prophecy.getRecipientId(),
        config.get('dentists')
      );

      this.replies = [textReply, gallery];

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

      const gallery = new Gallery(
        this.prophecy.getRecipientId(),
        config.get('reasons')
      );

      this.replies = [textReply, gallery];

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

        const picker = new Picker(
          this.prophecy.getRecipientId(),
          dayPickerConfig.get('button').get('text'),
          this.prophecy.getMessage(),
          dayPickerConfig.get('webview')
        );

        this.replies = [picker];

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
    name: 'When a bot books time for a dentist.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.dentist && context.reason && context.day && context.hour && context.validated);
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
    name: 'When a bot suggests free dates.',
    condition: function(R) {
      let context = this.prophecy.getContext();

      R.when(context.suggestions);
    },
    consequence: function(R) {
      const suggestionsConfig = config.get('messenger_templates').get('suggestions');

      let context = this.prophecy.getContext();

      const suggestions = new Suggestions(
        this.prophecy.getRecipientId(),
        suggestionsConfig.get('title'),
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
    name: 'When there is no matching rule.',
    condition: function(R) {
        R.when(true);
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
  }
];
