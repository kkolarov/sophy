'use strict';

const EntityExtractor = require('./utilities/EntityExtractor');
const extractor = new EntityExtractor({
  yes_no: {
    extract: true
  }
});

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    const extractedEntities = extractor.extract(entities);

    if (extractedEntities.yes_no === 'Не') {
      delete context.hour;
    } else {
      delete context.hour_step;
    }

    resolve(context);
  });
}
