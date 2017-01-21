'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');
const extractor = new EntityExtractor({
  hour: {
    extract: true
  }
});

module.exports = ({ context, entities }) => {
    return new Promise((resolve, reject) => {
      const extractedEntities = extractor.extract(entities);
      const mergedContext = _.merge(context, extractedEntities);

      delete mergedContext.day_step;
      mergedContext.hour_step = true;

      resolve(mergedContext);
    });
  }
