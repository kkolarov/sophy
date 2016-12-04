'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  day: {
    extract: true
  }
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    if (mergedContext.day) {
      delete mergedContext.suggestion_step;
    }

    resolve(mergedContext);
  });
};
