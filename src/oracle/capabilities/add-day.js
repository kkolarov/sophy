'use strict';

const _ = require('lodash');
const moment = require('moment');

const EntityExtractor = require('@fanatic/Oracle/utilities/EntityExtractor');
const extractor = new EntityExtractor({
  day: {
    extract: true
  }
});

const METADATA_KEY = 'day';

/**
*
* @param manager Context Manager
*/
module.exports = (manager) => {
  return ({ context, entities }) => {
    return new Promise((resolve, reject) => {
      const extractedEntities = extractor.extract(entities);
      const mergedContext = _.merge(context, extractedEntities);

      if (extractedEntities.hasOwnProperty('day')) {
        const metadata = extractedEntities.day;

        manager.addMetadata(mergedContext.recipient.id, METADATA_KEY, metadata)
          .then(() => {
            //TODO: The appropriate date format has to loaded from a config file.
            mergedContext.day = moment(metadata).format('DD.MM');

            resolve(mergedContext);
          })
          .catch(err => reject(err));
      } else {
        resolve(context);
      }
    });
  }
}
