'use strict';

module.exports = (conversationManager, messenger, assistant) => {
  return {
    send: require('./deliver')(conversationManager, messenger),
    book: require('./book')(assistant),
    suggest: require('./suggest')(assistant),
    extend_dentist: require('./extend-dentist'),
    validate_dentist: require('./validate-dentist'),
    change_hour: require('./change-hour'),
    confirm_hour: require('./confirm-hour'),
    validate_day: require('./validate-day'),
    update_context: require('./update-context')
  }
}
