'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  hour: true,
  yes_no: true
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    if (mergedContext.yes_no) {
      if (mergedContext.yes_no == 'Да') {
        delete mergedContext.hour;
      }

      delete mergedContext.yes_no;
    }
  
    resolve(mergedContext);
  });
};
