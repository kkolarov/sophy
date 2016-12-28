'use strict';

const oo = -987654321;

module.exports = (conversationManager) => {
  return [
    // require('./day-picker')({
    //   name: "When the bot delivers a day picker from which a client can choose a preferred hour.",
    //   priority: 1024
    // }),
    require('./response-processing')({
      name: "When the bot processes a client's response.",
      priority: 512
    }),
    require('./dentist-not-found')({
      name: "When the bot reports to a client that the dentist specified by him haven't been found.",
      priority: 256
    }),
    require('./dentists-gallery')(conversationManager)({
      name: "When the bot suggests a collection of dentists.",
      priority: 128
    }),
    require('./complaints-gallery')({
      name: "When the bot suggests a collection of complaints.",
      priority: 64
    }),
    require('./time-picker')({
      name: "When the bot delivers a time picker from which a client can choose a preferred hour.",
      priority: 32
    }),
    require('./hour-confirmation')({
      name: "When the bot asks a client to confirm the hour specified by him.",
      priority: 16
    }),
    require('./suggestions-waiting')({
      name: "When the bot asks a client to wait for suggestions composed by free days.",
      priority: 8
    }),
    require('./free-dates-gallery')({
      name: "When the bot makes a suggestion for days that are free and can be reserved.",
      priority: 4
    }),
    require('./reservation')({
      name: "When the bot reserves time in a dentist's calendar.",
      priority: 2
    }),
    require('./default')({
      name: "When the bot cant't judge which templates have to be used.",
      priority: oo
    })
  ];
}
