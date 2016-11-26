'use strict';

const QuickReply = require('./QuickReply');
const TypingReply = require('./TypingReply');
const TextReply = require('./TextReply');
const Picker = require('./custom/Picker');
const Suggestions = require('./custom/Suggestions');
const DentistSuggestion = require('./custom/DentistSuggestion');
const Gallery = require('./custom/Gallery');
const Card = require('./custom/Card');

module.exports = {
  TypingReply: TypingReply,
  QuickReply: QuickReply,
  TextReply: TextReply,
  Card: Card,
  Gallery: Gallery,
  Picker: Picker,
  Suggestions: Suggestions,
  DentistSuggestion: DentistSuggestion
};
