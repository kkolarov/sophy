'use strict';

const _ = require('lodash');

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

      const prophecy = {
          recipientId: req.context.recipient.id,
          message: res.text,
          quickReplies: res.quickreplies,
          context: req.context,
          metadata: {
            accessToken: 'EAAUOJNOMzfwBAP7RwbfYoVJY1RkvAjCiqpLssEn6ykFGp1um919dOdY1bGW1BzkZBcAXXOFzXIQNBb9rUd2OvDJSDIkSZAFl5pGH39ObwzmcyKLgDhYb56DT8cLCFKkk1rXRaUugPsYWBSo6Mn9Cg5KwvLzc0TaKei99yx9AZDZD'
          }
      };

      messenger.deliver(prophecy, (err, flag) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
}

module.exports = deliver;
