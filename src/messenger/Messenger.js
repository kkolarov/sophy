'use strict';

const request = require('request');

const chalk = require('chalk');

/**
*
* @author Kamen Kolarov
*/
class Messenger {

  constructor(prophecyInterpreter, config) {
    this._prophecyInterpreter = prophecyInterpreter;
    this._config = config;
  }

  _request(template) {
    return new Promise((resolve, reject) => {
      request({
        uri: this._config.uri,
        qs: { access_token: this._config.accessToken },
        method: template.method,
        json: template.reply
      }, (err, res, body) => {
        if (!err && res.statusCode == 200) {
          resolve();
        } else {
          reject(new Error(body.error.message));
        }
      });
    });
  }

  /**
  * This method delivers series of template responses to a client.
  *
  * @param /oracle/Prophecy prophecy
  * @param Callback cb
  *
  * @return Callback cb
  */
  deliver(prophecy, cb) {
    this._prophecyInterpreter.interpret(prophecy, (err, res) => {
      if (!err) {
        let promises = [];

        for (let i = 0; i < res.templates.length; ++i) {
          let promise = this._request(res.templates[i]);
          promises.push(promise);
        }

        Promise.all(promises).then(() => {
          cb(null, true);
        }).catch(exception => {
          cb(exception, null);
        });
      }
    });
  }
}

module.exports = Messenger;
