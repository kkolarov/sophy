'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  desire: {
    extract: true
  }
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    if (mergedContext.desire) {
      delete mergedContext.suggestion_step;
      delete mergedContext.suggestions;
      delete mergedContext.desire;
      delete mergedContext.hour;
    }

    resolve(mergedContext);
  });
};