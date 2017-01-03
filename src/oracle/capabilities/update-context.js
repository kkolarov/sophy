'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  hour: {
    extract: true
  },
  day: {
    extract: true
  }
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    resolve(mergedContext);
  });
};
