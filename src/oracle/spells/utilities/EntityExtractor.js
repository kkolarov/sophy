'use strict';

const _ = require('lodash');

/**
*
* @author Kamen Kolarov
*/
class EntityExtractor {

  constructor(map) {
    this._map = map;
  }

  /**
  * This methods extract entities described in the map object.
  *
  * @param Json entities
  *
  * @return Json
  */
  extract(entities) {
    let newEntities = {};

    _.forEach(entities, (value, key) => {
      if (_.has(this._map, key)) {
        newEntities[key] = entities[key][0].value;
      }
    });

    return newEntities;
  }
}

module.exports = EntityExtractor;
