'use strict';

const Algorithm = require('./Algorithm');

const { BusyTimeException } = require('../../exceptions');

/**
* A concrete algorithm that checks whether client's request for day & hour is already reserved or not.
*
* @author Kamen Kolarov
*/
class HourAlgorithm extends Algorithm {

  constructor(calendar, model, adapter, validator) {
    super(calendar, model, adapter, validator);
  }

  /**
  * This method checks whether a client's request for day & hour is free.
  *
  * @param String calendarId
  * @param String day e.g 11/31/2016
  * @param String hour e.g 16:00
  * @param JSON estimation
  * @param Callback cb
  *
  * @return Callback cb
  */
  isFree(calendarId, day, hour, estimation, cb) {
    this._validator.validate(day, hour, (exception, passed) => {
        if (passed) {
          const date = this._adapter.adaptEstimation(day, hour, estimation);

          this.checkWorkingTime(calendarId, date, day,
            (exception, res) => {
              if (!exception) {
                this.isUpcomingDate(date, (exception, res) => {
                  if (!exception) {
                    this._calendar.getEvents(calendarId, date).then((events) => {
                      if (events.length === 0) {
                        cb(null, date);
                      } else {
                        cb(new BusyTimeException(), null);
                      }
                    }).catch((exception) => {
                      cb(exception, null);
                    });
                  } else {
                    cb(exception, null);
                  }
                });
              } else {
                cb(exception, null);
              }
          });
        } else {
          cb(exception, null);
        }
    });
  }
}

module.exports = HourAlgorithm;
