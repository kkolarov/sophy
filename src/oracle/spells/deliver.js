'use strict';

const _ = require('lodash');

const Prophecy = require('../Prophecy');
const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  desire: true,
  service: true,
  profession: true,
  dentist: true,
  reason: true,
  hour: true,
  day: true
});

function deliver(messenger) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      let newEntities = extractor.extract(req.entities);

      let prophecy = new Prophecy(
        req.context.recipientId,
        res.text,
        res.quickreplies,
        newEntities,
        req.context
      );

      messenger.deliver(prophecy, (exception, flag) => {
        if (exception) {
          console.log(exception);
        }
      });

      return resolve();
    });
  }
}

module.exports = deliver;
