'use strict';

const _ = require('lodash');

const Prophecy = require('../Prophecy');
const EntityExtractor = require('./utilities/EntityExtractor');

const extractor = new EntityExtractor({
  dentist: {
    extract: true
  },
  reason: {
    extract: true,
    metadata: {
      extract: true,
      parse: true
    }
  },
  hour: {
    extract: true
  },
  day: {
    extract: true
  }
});

function deliver(messenger) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      const extractedEntities = extractor.extract(req.entities);

      const prophecy = new Prophecy(
        req.context.recipient.id,
        res.text,
        res.quickreplies,
        req.context
      );

      messenger.deliver(prophecy, (exception, flag) => {
        if (!exception) {
          resolve();
        } else {
          reject(exception);
        }
      });
    });
  }
}

module.exports = deliver;
