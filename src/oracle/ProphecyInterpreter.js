'use strict';

const RuleEngine = require('node-rules');

const formulas = require('./formulas');

/**
*
* @author Kamen Kolarov
*/
class ProphecyInterpreter {

  constructor() {
    this._formulaEngine = new RuleEngine(formulas);
  }

  /**
  * This interpret method aims to determine which reply templates will be returned to a client.
  *
  * @param /oracle/Prophecy prophecy
  * @param Callback cb
  *
  * @return Callback cb
  */
  interpret(prophecy, cb) {
    this._formulaEngine.execute({
      prophecy: prophecy
    }, (res) => {
      cb(null, res);
    });
  }
}

module.exports = ProphecyInterpreter;
