'use strict';

const _ = require('lodash');

const Prophecy = require('../Prophecy');
const EntityExtractor = require('../EntityExtractor');

const extractor = new EntityExtractor({
  desire: true,
  profession: true,
  dentist: true,
  reason: true,
  time: true,
  day: true
});

function send(messenger) {
  return (req, res) => {
    return new Promise(function(resolve, reject) {
      let newEntities = extractor.extract(req.entities);

      let prophecy = new Prophecy(
        req.context.recipientId,
        res.text,
        res.quickreplies,
        newEntities,
        req.context
      );

      messenger.deliver(prophecy, (err, res) => {});

      return resolve();
    });
  }
}

module.exports = send;
