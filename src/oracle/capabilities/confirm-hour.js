'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');
const extractor = new EntityExtractor({
  hour: {
    extract: true
  },
  yes_no: {
    extract: true
  }
});

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    if (mergedContext.yes_no === 'Не') {
      delete mergedContext.hour;
    }

    resolve(mergedContext);
  });
}
