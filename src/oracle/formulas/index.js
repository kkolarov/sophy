'use strict';

const oo = -987654321;

module.exports = (manager, logger) => {
  return [
    require('./errors')(logger)({
      name: "When the bot handles errors thrown by the Assistant.",
      priority: 1028
    }),
    require('./response-processing')(logger)({
      name: "When the bot processes a client's response.",
      priority: 512
    }),
    require('./dentists-gallery')(manager, logger)({
      name: "When the bot suggests a collection of dentists.",
      priority: 128
    }),
    require('./complaints-gallery')(logger)({
      name: "When the bot suggests a collection of complaints.",
      priority: 64
    }),
    require('./time-picker')(logger)({
      name: "When the bot delivers a time picker from which a client can choose a preferred hour.",
      priority: 32
    }),
    require('./confirmation')(logger)({
      name: "When the bot asks a client to confirm the action selected by him.",
      priority: 16
    }),
    require('./day-picker')(logger)({
      name: "When the bot delivers a day picker from which a client can choose a preferred hour.",
      priority: 8
    }),
    require('./reservation')(logger)({
      name: "When the bot makes a reservation in an employee's calendar.",
      priority: 2
    }),
    require('./default')(logger)({
      name: "When the bot cant't judge which templates have to be used.",
      priority: oo
    })
  ];
}
