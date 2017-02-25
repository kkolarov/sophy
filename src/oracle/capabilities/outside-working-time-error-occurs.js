'use strict';

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    delete context.outside_working_time_error;
    delete context.hour;

    resolve(context);
  });
}
