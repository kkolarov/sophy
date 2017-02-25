'use strict';

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    delete context.busy_time_error;
    delete context.hour;
    delete context.day;

    resolve(context);
  });
}
