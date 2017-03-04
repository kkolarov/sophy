'use strict';

const _ = require('lodash');

const EntityExtractor = require('@fanatic/Oracle/utilities/EntityExtractor');
const extractor = new EntityExtractor({
  hour: {
    extract: true
  }
});

module.exports = ({ context, entities }) => {
    return new Promise((resolve, reject) => {
      const extractedEntities = extractor.extract(entities);
      const mergedContext = _.merge(context, extractedEntities);

      if (extractedEntities.hasOwnProperty('hour')) {
        delete mergedContext.day_step;
        mergedContext.hour_step = true;

        resolve(mergedContext);
      } else {
        resolve(context);
      }
    });
  }
