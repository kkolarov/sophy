'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  dentist: {
    extract: true
  }
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    if (!mergedContext.dentist) {
      mergedContext.unknown_dentist = true;
    } else {
      delete mergedContext.unknown_dentist;

      mergedContext.validated_dentist = true;
    }

    resolve(mergedContext);
  });
};
