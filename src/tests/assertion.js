'use strict';

const assertThatSuccessWith = (done, assertion) => {
  return (exception, response) => {
    if (!exception) {
      try {
        assertion(response);
        done();
      } catch(e) {
        done(e);
      }
    } else {
      done(exception);
    }
  }
}

const assertThatFailWith = (done, assertion) => {
  return (exception, response) => {
    if (exception) {
      try {
        assertion(exception);
        done();
      }catch(e) {
        done(e);
      }
    } else {
      done(new Error('There is no exception that has been raised.'));
    }
  }
}

module.exports = {
  assertThatSuccessWith: assertThatSuccessWith,
  assertThatFailWith: assertThatFailWith
}
