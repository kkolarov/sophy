'use strict';

const QuickReply = require('./QuickReply');
const TypingReply = require('./TypingReply');
const TextReply = require('./TextReply');
const Picker = require('./custom/Picker');
const DatesGallery = require('./custom/DatesGallery');
const DentistsGallery = require('./custom/DentistsGallery');
const ReasonsGallery = require('./custom/ReasonsGallery');
const Card = require('./custom/Card');

module.exports = {
  TypingReply: TypingReply,
  QuickReply: QuickReply,
  TextReply: TextReply,
  Card: Card,
  Picker: Picker,
  ReasonsGallery: ReasonsGallery,
  DatesGallery: DatesGallery,
  DentistsGallery: DentistsGallery
};
