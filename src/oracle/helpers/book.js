'use strict';

const _ = require('lodash');

const EntityExtractor = require('../EntityExtractor');

const extractor = new EntityExtractor({
  desire: true,
  profession: true,
  dentist: true,
  reason: true,
  time: true,
  day: true
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    let newEntities = extractor.extract(entities);
    let newContext = _.merge(context, newEntities);

    if (!newContext.dentist) {
      delete newContext.missing_reason;
      delete newContext.missing_day;
      delete newContext.missing_time;

      newContext.missing_dentist = true;
    } else if (!newContext.reason) {
      delete newContext.missing_dentist;
      delete newContext.missing_day;
      delete newContext.missing_time;

      newContext.missing_reason = true;
    } else if (!newContext.day) {
      delete newContext.missing_dentist;
      delete newContext.missing_reason;
      delete newContext.missing_time;

      newContext.missing_day = true;
    } else if (!newContext.time) {
      delete newContext.missing_dentist;
      delete newContext.missing_reason;
      delete newContext.missing_day;

      newContext.missing_time = true;
    } else {
      newContext.done = true;
    }

    return resolve(newContext);
  });
};
