'use strict';

const RuleEngine = require('node-rules');

const formulas = require('../spell');

/**
*
* @author Kamen Kolarov
*/
class ProphecyInterpreter {

  constructor() {
    this._prophecyEngine = new RuleEngine(formulas);
  }

  /**
  * This interpret method aims to determine which reply template will be returned to a client.
  *
  * @param /oracle/Prophecy prophecy
  * @param Callback cb
  *
  * @return Callback cb
  */
  interpret(prophecy, cb) {
    this._prophecyEngine.execute({
      prophecy: prophecy
    }, (res) => {
      cb(null, res);
    });
  }
}

module.exports = ProphecyInterpreter;
