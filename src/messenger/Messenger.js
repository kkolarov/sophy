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
  * This method sends a request to a given url.
  *
  * @param JSON template
  *
  * @return Promise
  */
  _request(template) {
    return new Promise((resolve, reject) => {
      request({
        uri: this._config.uri,
        qs: { access_token: this._config.accessToken },
        method: 'POST',
        json: template
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
        const replies = res.replies;
        let promises = [];

        for (let i = 0; i < replies.length; ++i) {
          let promise = this._request(replies[i].getTemplate());
          promises.push(promise);
        }

        Promise.all(promises).then(() => {
          cb(null, replies);
        }).catch(exception => {
          cb(exception, null);
        });
      }
    });
  }
}

module.exports = Messenger;
