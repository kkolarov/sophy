'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: ['dentist'],
    required: true
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

employeeSchema.statics.findEmployeeById = (id, cb) => {
  return Employee.findOne({
    _id: id
  }, cb);
}

employeeSchema.statics.findEmployeeByName = (name, cb) => {
  return Employee.findOne({
    name: name
  }, cb);
}

employeeSchema.statics.findEmployeeByCalendarId = (calendarId, cb) => {
  return Employee.findOne({calendarId: calendarId}, cb);
}

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
