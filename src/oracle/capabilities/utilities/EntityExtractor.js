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

  _isPermittedEntityKey(key) {
    return _.has(this._map, key) && this._map[key].extract;
  }

  _haveToParseEntityMetadata(key) {
    return this._map[key].metadata && this._map[key].metadata.parse;
  }

  /**
  * This methods extract entities described in the map object.
  *
  * @param Json entities
  *
  * @return Json
  */
  extract(entities) {
    let permittedEntities = {};

    _.forEach(entities, (values, key) => {
      if (this._isPermittedEntityKey(key)) {
        if (this._haveToParseEntityMetadata(key)) {
          const metadataEntities = JSON.parse(values[0].metadata);

          permittedEntities[key] = metadataEntities;
          permittedEntities[key].value = values[0].value;
        } else {
          permittedEntities[key] = values[0].value;
        }
      }
    });

    return permittedEntities;
  }
}

module.exports = EntityExtractor;
