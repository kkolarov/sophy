'use strict';

module.exports = ({ context, entities }) => {
  return new Promise((resolve, reject) => {
    delete context.expired_date_error;
    delete context.day;

    resolve(context);
  });
}
