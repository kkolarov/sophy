'use strict';

const { MessageReceived, PostbackReceived } = require('./callbacks');

class CallbackFactory {

  get(objType, pageId, event) {
    let cb = null;

    if (event.optin) {

    } else if (event.message) {
      cb = new MessageReceived(objType, pageId, event.sender.id, event.recipient.id, event.message);
    } else if (event.delivery) {

    } else if (event.postback) {
      cb = new PostbackReceived(objType, pageId, event.sender.id, event.recipient.id, event.postback.payload);
    } else {

    }

    return cb;
  }
}

module.exports = new CallbackFactory();
