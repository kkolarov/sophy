'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  desire: true,
  profession: true,
  dentist: true,
  reason: true,
  time: true,
  day: true
});

const contextManager = require('./utilities/context-managers/book');

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    contextManager.update(mergedContext).then((context) => {
      resolve(context);
    });
  });
};
