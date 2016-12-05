'use strict';

module.exports = (messenger) => {
  return {
    send: require('./deliver')(messenger),
    book: require('./book'),
    suggest: require('./suggest'),
    extend_dentist: require('./extend-dentist'),
    validate_dentist: require('./validate-dentist'),
    change_hour: require('./change-hour'),
    confirm_hour: require('./confirm-hour'),
    validate_day: require('./validate-day'),
    validate_hour: require('./validate-hour')
  }
}
