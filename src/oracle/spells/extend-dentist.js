'use strict';

const _ = require('lodash');

const EntityExtractor = require('./utilities/EntityExtractor');
const Employee = require('../../models/Employee');

const extractor = new EntityExtractor({
  dentist: {
    extract: true
  }
});

module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    if (!mergedContext.dentist.name) {
      Employee.findEmployeeByName(mergedContext.dentist, (err, employee) => {
        mergedContext.dentist = {
          name: employee.name,
          pictureUrl: employee.pictureUrl,
          calendarId: employee.calendarId,
          workingTime: {
            start: employee.workingTime.weekly.start,
            end: employee.workingTime.weekly.end
          }
        };

        delete mergedContext.dentist_step;
        delete mergedContext.validated_dentist;

        resolve(mergedContext);
      });
    } else {
      resolve(mergedContext);
    }
  });
};
