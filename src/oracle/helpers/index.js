'use strict';

module.exports = (messenger) => {
  return {
    send: require('./send')(messenger),
    book_dentist: require('./book-dentist')
  }
}
