'use strict';

const cbFactory = require('./CallbackFactory');

const _ = require('lodash');

class Batch {
  constructor(objType, batch) {
    this._events = [];

    batch.messaging.forEach(event => {
        let cb = cbFactory.get(objType, batch.id, event);

        if (!_.isNull(cb)) {
          this._events.push(cb);
        }
    });
  }
}

module.exports = Batch;
