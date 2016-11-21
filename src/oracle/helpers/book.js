'use strict';

const _ = require('lodash');

const EntityExtractor = require('../EntityExtractor');

const extractor = new EntityExtractor({
  desire: true,
  profession: true,
  dentist: true,
  reason: true,
  time: true,
  day: true
});

const contextManager = (() => {
  let handlers = [];

  const checkDentist = () => {
    return {
      update: (context) => {
        if (context.dentist) {
          delete context.missing_dentist;

          return false;
        } else {
          context.missing_dentist = true;

          return true;
        }
      }
    }
  }

  const checkReason = () => {
    return {
      update: (context) => {
        if (context.reason) {
          delete context.missing_reason;

          return false;
        } else {
          context.missing_reason = true;

          return true;
        }
      }
    }
  }

  const checkDay = () => {
    return {
      update: (context) => {
        if (context.day) {
          delete context.missing_day;

          return false;
        } else {
          context.missing_day = true;

          return true;
        }
      }
    }
  }

  const checkHour = () => {
    return {
      update: (context) => {
        if (context.time) {
          delete context.missing_time;

          return false;
        } else {
          context.missing_time = true;

          return true;
        }
      }
    }
  }

  const validation = () => {
    return {
      update: (context) => {
        return true;
      }
    }
  }

  const book = () => {
    return {
      update: (context) => {
        context.done = true;

        return true;
      }
    }
  }

  handlers = [checkDentist(), checkReason(), checkDay(), checkHour(), validation(), book()];

  return {
    update: (context) => {
      for (let i = 0; i < handlers.length; ++i) {
        if (handlers[i].update(context)) {
          break;
        }
      }

      return context;
    }
  };
})();


module.exports = ({context, entities}) => {
  return new Promise(function(resolve, reject) {
    const extractedEntities = extractor.extract(entities);
    const mergedContext = _.merge(context, extractedEntities);

    const updatedContext = contextManager.update(mergedContext);

    return resolve(updatedContext);
  });
};
