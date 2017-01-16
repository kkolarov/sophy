'use strict';

const _ = require('lodash');
const moment = require('moment');

const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  hour: {
    extract: true
  },
  day: {
    extract: true
  }
});

/**
*
* @param manager Context Manager
*/
const updateContext = (manager) => {
  return ({ context, entities }) => {
    return new Promise((resolve, reject) => {
      const extractedEntities = extractor.extract(entities);
      const mergedContext = _.merge(context, extractedEntities);

      if (extractedEntities.hasOwnProperty('day')) {
        const metadataKey = 'day';
        const metadata = extractedEntities.day;

        manager.addMetadata(mergedContext.recipient.id, metadataKey, metadata)
          .then(() => {
            mergedContext.day = moment(metadata).format('DD.MM');

            resolve(mergedContext);
          })
          .catch(err => {
            reject(err);
          });
      } else if (extractedEntities.hasOwnProperty('hour')) {
        delete mergedContext.day_step;
        mergedContext.hour_step = true;

        resolve(mergedContext);
      } else {
        resolve(mergedContext);
      }
    });
  }
}

module.exports = updateContext;
