'use strict'

const _ = require('lodash');

/**
*
* @author Kamen Kolarov
*/
class DentistDurationEstimator {

  constructor() {

  }

  _haveHoursProperty(context) {
    return _.has(context, 'reason.duration.hours');
  }

  _haveMinutesProperty(context) {
    return _.has(context, 'reason.duration.minutes');
  }

  /**
  *
  * @param JSON context
  *
  * @return Promise
  */
  estimate(context) {
    const that = this;

    return new Promise((resolve, reject) => {
      if (that._haveHoursProperty(context) && that._haveMinutesProperty(context)) {
          const duration = {
            hours: context.reason.duration.hours,
            minutes: context.reason.duration.minutes
          };

          resolve(duration);
        } else {
          reject(new Error("There is missing either hours or minutes property."));
        }
    });
  }
}

module.exports = DentistDurationEstimator;
