'use strict';

/**
*
* @author Kamen Kolarov
*/
class Scheduler {

  /**
  *
  * @param Object calendar This module gives a way of manipulating a calendar.
  * @param Object checker This module detemines whether a client's request is valid based on the business rules.
  */
  constructor(calendar, checker) {
    this._calendar = calendar;
    this._checker = checker;
  }

  /**
  * This method checks the request validity based on the business rules.
  * Rule 1: A client's request for day & hour mustn't be reserved by someone else.
  * Rule 2: A client's request for day & hour mustn't be in the past.
  * Rule 3: A client's request for day & hour must be in the specified working time.
  *
  * @param JSON req
  * @param Callback cb
  *
  * @return Callback
  */
  isApproved(req, cb) {
    this._checker.check(req, (err, date) => {
      if (!err) {
        cb(null, date);
      } else {
        cb(err, null);
      }
    });
  }

  /**
  * This method adds a client's request for day & hour in a calendar.
  *
  * @param String calendarId
  * @param String sender
  * @param String description
  * @param JSON date
  * @param Callback cb
  *
  * @return Callback cb
  */
  schedule(calendarId, sender, description, date, cb) {
    const event = {
      sender: sender,
      description: JSON.stringify(description),
      colorId: this._calendar.getEventColors().YELLOW,
      date: date
    };

    this._calendar.createEvent(calendarId, event)
      .then((event) => {
        cb(null, event);
      })
      .catch((exception) => {
        cb(exception, null);
      });
  }
}

module.exports = Scheduler;
