'use strict';

const express = require('express');
const config = require('config');
const moment = require('moment');
const _ = require('lodash');

const { DentalVisitEstimator } = require('../reservation/estimators');
const estimator = new DentalVisitEstimator();

const getAllDatesArray = () => {
  const maxDays = config.reservation.suggester.maxDays;

  let allDatesArray = [];

  for (let i = 0; i < maxDays; ++i) {
    allDatesArray.push(moment().add(i, 'day').format('MM-DD-YYYY'));
  }

  return allDatesArray;
}

const getFreeDatesArray = (suggestions) => {
  return suggestions.map(suggestion => {
    return moment(suggestion.start).format('MM-DD-YYYY');
  });
}

/**
*
* @param @fanatic/reservation/Assistant assistant
* @param @fanatic/conversations/NativeConversationManager manager
*
* @return Router
*/
const suggestionsRouter = (assistant, manager) => {
  const router = express.Router();

  router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    // A context object that plays role of a stub.

    // const context = {
    //   "recipient": {
    //     "id": 1213342445381976,
    //     "name": "Kamen Kolarov"
    //   },
    //   "page": {
    //     "id": 1235981259820368
    //   },
    //   "dentist": {
    //     "name":"Д-р Йонов",
    //     "pictureUrl":"http://yonov.eu/wp-content/uploads/2016/08/DSCN1465-1.jpg",
    //     "calendarId": "fetfjslqogof3759gph1krs0a4@group.calendar.google.com",
    //     "workingTime": {
    //       "start": "09:00",
    //       "end": "18:00"
    //     },
    //     "address": "бул. Черни връх 47"
    //   },
    //   "reason": {
    //     "duration": {
    //       "hours": 0,
    //       "minutes": 30
    //     },
    //     "value":"Профилактичен преглед"
    //   },
    //   "hour": "15:00"
    // }

    manager.findConversationByUserId(userId)
      .then(conversation => {
        const context = conversation.context;

        estimator.estimate(context)
          .then(duration => {
            const today = moment(new Date()).format('YYYY-MM-DD');

            const request = {
              calendarId: context.dentist.calendarId,
              sender: context.recipient.name,
              day: today,
              hour: context.hour,
              duration: duration
            };

            console.log(request);

            assistant.suggest(request)
              .then(suggestions => {
                console.log(suggestions);

                const allDates = getAllDatesArray();
                const freeDates = getFreeDatesArray(suggestions);

                const reservedDates = _.difference(allDates, freeDates);

                res.json(reservedDates);
              }).catch(err => {
                console.log(err);
              });

          }).catch(err => {
            console.log(err);
          });
      });
  });

  return router;
}

module.exports = suggestionsRouter;
