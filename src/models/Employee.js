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
    range: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      }
    },
    Monday: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      active: {
        type: Boolean,
        required: true
      }
    },
    Tuesday: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      active: {
        type: Boolean,
        required: true
      }
    },
    Wednesday: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      active: {
        type: Boolean,
        required: true
      }
    },
    Thursday: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      active: {
        type: Boolean,
        required: true
      }
    },
    Friday: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      active: {
        type: Boolean,
        required: true
      }
    },
    Saturday: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      active: {
        type: Boolean,
        required: true
      }
    },
    Sunday: {
      start: {
        type: String
      },
      end: {
        type: String
      },
      active: {
        type: Boolean,
        required: true
      }
    }
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
  return Employee.find({ name: name })
    .populate('_business')
    .exec();
}

employeeSchema.statics.findEmployeesByBusinessId = (businesId, size, order = 1) => {
  return Employee.find({ _business: businesId })
    .limit(size)
    .sort({ created_date: order });
}

employeeSchema.statics.findEmployeeByCalendarId = (calendarId) => {
  return Employee.findOne({ calendarId: calendarId });
}

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
