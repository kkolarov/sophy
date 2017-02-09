'use strict';

module.exports = (manager, messenger, assistant) => {
  return {
    send: require('./deliver')(manager, messenger),
    book: require('./book')(manager, assistant),
    suggest: require('./suggest')(assistant),
    expand_employee: require('./expand-employee'),
    exist_one_employee: require('./exist-one-employee')(manager),
    confirm_day: require('./confirm-day'),
    confirm_hour: require('./confirm-hour'),
    add_hour: require('./add-hour'),
    add_day: require('./add-day')(manager),
    update_hour: require('./update-hour'),
    busy_time_error_occurs: require('./busy-time-error-occurs'),
    outside_working_time_error_occurs: require('./outside-working-time-error-occurs'),
    expired_date_error_occurs: require('./expired-date-error-occurs')
  }
}
