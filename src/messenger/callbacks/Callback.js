'use strict';

class Callback  {
  constructor(objType, pageId, senderId, recipientId) {
    this._objType = objType;
    this._pageId = pageId;
    this._senderId = senderId;
    this._recipientId = recipientId;
  }

  getPageId() {
    return this._pageId;
  }

  getSenderId() {
    return this._senderId;
  }

  getRecipientId() {
    return this._recipientId;
  }

  comesFromPage() {
    return this._objType === "page" ? true : false;
  }

  isMessageReceived() {
    return false;
  }

  isEcho() {
    return false;
  }
}

module.exports = Callback;
