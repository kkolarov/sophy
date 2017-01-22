'use strict';

const Employee = require('../../models/Employee');

const existOneEmployee = (manager) => {
  return ({context, entities}) => {
    return new Promise(function(resolve, reject) {
      const userId = context.recipient.id;

      manager.findConversationByUserId(userId)
        .then(conversation => {
          const page = conversation.metadata.page;

          return Employee.findEmployeesByBusinessId(page._business, 2);
        })
        .then(employees => {
          if (employees && employees.length === 1) {
            const employee = employees[0];

            context.dentist = {
              name: employee.name,
              pictureUrl: employee.pictureUrl,
              calendarId: employee.calendarId,
              workingTime: {
                start: employee.workingTime.weekly.start,
                end: employee.workingTime.weekly.end
              },
              address: employee._business.address
            };
          }

          resolve(context);
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = existOneEmployee;
