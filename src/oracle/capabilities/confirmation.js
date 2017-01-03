'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');
const extractor = new EntityExtractor({
  hour: {
    extract: true
  },
  day: {
    extract: true
  },
  yes_no: {
    extract: true
  }
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    if (mergedContext.yes_no) {
      if (mergedContext.yes_no == 'Не') {
        if (mergedContext.hasOwnProperty('hour_step')) {
          delete mergedContext.hour;
        } else if (mergedContext.hasOwnProperty('day_step')) {
          delete mergedContext.day;
        }
      }
    }

    resolve(mergedContext);
  });
};
