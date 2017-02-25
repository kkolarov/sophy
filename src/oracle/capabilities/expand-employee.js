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

      if (mergedContext.hasOwnProperty('dentist')) {
        const dentist = mergedContext.dentist;

        Employee.findEmployeeByName(dentist)
          .then(employees => {
            if (employees) {
              const employee = employees[0];

              mergedContext.dentist = {
                name: employee.name,
                phoneNumber: employee.phoneNumber,
                pictureUrl: employee.pictureUrl,
                calendarId: employee.calendarId,
                workingTime: {
                  start: employee.workingTime.weekly.start,
                  end: employee.workingTime.weekly.end
                },
                address: employee._business.address
              };
            }

            resolve(mergedContext);
          })
          .catch(err => reject(err));
      } else {
        resolve(mergedContext);
      }
    });
  }
