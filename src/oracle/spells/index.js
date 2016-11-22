'use strict';

module.exports = (messenger) => {
  return {
    send: require('./deliver')(messenger),
    book: require('./book'),
    suggest: require('./suggest')
  }
}
