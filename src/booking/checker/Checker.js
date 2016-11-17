'use strict';

const _ = require('lodash');

/**
* This module decouples a context in which a particular algorithm is selected from its implementation.
*
* @author Kamen Kolarov
*/
class Checker {

  /**
  *
  * @param Array algorithms
  */
  constructor(algorithms) {
      this._algorithms = algorithms;
  }

  _isSelectedHour(req) {
    return _.has(req, 'hour') ? true : false;
  }

  _isSelectedTime(req) {
    return _.has(req, 'time') ? true : false;
  }

  /**
  * This method determines which algorithm has to be selected.
  *
  * @param JSON req
  * @param Callback cb
  *
  * @return Callback cb
  */
  check(req, cb) {
    if (this._isSelectedHour(req)) {
      this._algorithms[0].isFree(req.calendarId, req.day, req.hour, req.estimation, cb);
    } else if (this._isSelectedTime(req)) {
      this._algorithms[1].isFree(req.calendarId, req.day, req.time, req.estimation, cb);
    } else {
      cb(new Error('There is no appropriate algorithm for this kind of request'), null);
    }
  }
}

module.exports = Checker;
