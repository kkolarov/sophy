'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Business = require('./Business');

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: ['dentist'],
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  pictureUrl: String,
  aboutMe: String,
  workingTime: {
    weekly: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        required: true
      }
    },
    holiday: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        required: true
      }
    },
  },
  calendarId: {
    type: String
  },
  _business: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  }
}, {
  collection: 'employees'
});

// TODO: This option has to be disabled on production environment.
employeeSchema.set('autoIndex', true);

employeeSchema.statics.findEmployeeByName = (name) => {
  return new Promise((resolve, reject) => {
    Employee.find({ name: name })
      .populate('_business')
      .exec(function (err, employee) {
        if (!err) {
          resolve(employee);
        } else {
          reject(err);
        }
      });
  });
}

employeeSchema.statics.findEmployeesByBusinessId = (businesId, size, order = 1) => {
  return new Promise((resolve, reject) => {
    Employee.find({ _business: businesId }, (err, employees) => {
      if (!err) {
        resolve(employees);
      } else {
        reject(err);
      }
    })
    .limit(size)
    .sort({ created_date: order });
  });
}

employeeSchema.statics.findEmployeeByCalendarId = (calendarId) => {
  return new Promise((resolve, reject) => {
    Employee.findOne({ calendarId: calendarId }, (err, employee) => {
      if (!err) {
        resolve(employee);
      } else {
        reject(err);
      }
    });
  });
}

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
