'use strict';

module.exports = (manager, messenger, assistant) => {
  return {
    send: require('./deliver')(manager, messenger),
    book: require('./book')(manager, assistant),
    suggest: require('./suggest')(assistant),
    extend_dentist: require('./expand-employee')(),
    validate_dentist: require('./validate-dentist'),
    change_hour: require('./change-hour'),
    confirmation: require('./confirmation'),
    validate_day: require('./validate-day'),
    update_context: require('./update-context')(manager)
  }
}
