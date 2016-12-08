'use strict';

const moment = require('moment');
const config = require('config');
/**
* This module suggests free dates according to a client's request.
*
* @author Kamen Kolarov
*/
class Suggester {

  /**
  *
  * @param Object checker This module detemines whether a client's request is valid based on the business rules.
  * @param Object adapter This module adaptes client's request for day & hour.
  * @param Object config
  */
  constructor(checker, adapter) {
    this._checker = checker;
    this._adapter = adapter;
    this._config = config.get('suggester');
  }

  /**
  *
  * @param String date
  * @param Number days
  *
  * @return String date
  */
  _newDay(date, days) {
    return moment(date, this._adapter.getDateFormat()).add(days, 'days').format(this._adapter.getDayFormat());
  }

  /**
  *
  * @param JSON req
  * @param Callback cb
  *
  * @return Callback cb
  */
  suggest(req, cb) {
    const that = this;
    const maxDays = this._config.get('maxDays');
    let suggestions = [];

    (function nextDay(days) {
      // TODO: Instead of using recursing execution, apply setTimeout
      if (days > maxDays) {
        cb(null, suggestions);

        return;
      }

      req.day = that._newDay(req.day, 1);

      that._checker.check(req, (err, date) => {
        if (!err) {
          suggestions.push(date);

          if (suggestions.length == that._config.get('maxSuggestions')) {
            cb(null, suggestions);
          } else {
            nextDay(++days);
          }
        } else {
          cb(err, null);
        }
      });
    })(1);
  }
}

module.exports = Suggester;
