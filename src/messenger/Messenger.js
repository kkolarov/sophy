'use strict';

const request = require('request');

/**
*
* @author Kamen Kolarov
*/
class Messenger {

  constructor(prophecyInterpreter, config) {
    this._prophecyInterpreter = prophecyInterpreter;
    this._config = config;
  }

  /**
  * This method is concern to deliver any prohecy message to a client in the form of specific template.
  *
  * @param /oracle/Prophecy prophecy
  * @param Callback cb
  *
  * @return Callback cb
  */
  deliver(prophecy, cb) {
    this._prophecyInterpreter.interpret(prophecy, (err, res) => {
      if (!err) {
        request({
          uri: this._config.uri,
          qs: { access_token: this._config.accessToken },
          method: res.method,
          json: res.template
        }, cb);
      }
    });
  }
}

module.exports = Messenger;
