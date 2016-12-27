'use strict';

const express = require('express');
const moment = require('moment');
const _ = require('lodash');

const { DentalVisitEstimator } = require('../reservation/estimators');
const estimator = new DentalVisitEstimator();

const getAllDatesArray = () => {
  let allDatesArray = [];

  for (let i = 0; i < 20; ++i) {
    allDatesArray.push(moment().add(i, 'day').format('MM-DD-YYYY'));
  }

  return allDatesArray;
}

const getFreeDatesArray = (suggestions) => {
  return suggestions.map((suggestion) => {
    return moment(suggestion.start).format('MM-DD-YYYY');
  });
}

const suggestionsRouter = (assistant, manager) => {
  const router = express.Router();

  router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    manager.findConversationByUserId(userId)
      .then(conversation => {
        const context = {
          "recipient": {
            "id": 1092096170901736,
            "name": "Kamen Kolarov"
          },
          "page": {
            "id": 1235981259820368
          },
          "dentist": {
            "name":"Д-р Йонов",
            "pictureUrl":"http://yonov.eu/wp-content/uploads/2016/08/DSCN1465-1.jpg",
            "calendarId": "fetfjslqogof3759gph1krs0a4@group.calendar.google.com",
            "workingTime": {
              "start": "09:00",
              "end": "18:00"
            }
          },
          "reason": {
            "duration": {
              "hours": 0,
              "minutes": 30
            },
            "value":"Профилактичен преглед"
          },
          "hour": "15:00"
        };

        estimator.estimate(context)
          .then(duration => {
            const today = moment().format('MM-DD-YYYY');

            const request = {
              calendarId: context.dentist.calendarId,
              sender: context.recipient.name,
              day: today,
              hour: context.hour,
              duration: duration
            };

            assistant.suggest(request, {
              maxResult: 20
            }, (err, suggestions) => {
              if (!err) {
                const allDates = getAllDatesArray();
                const freeDates = getFreeDatesArray(suggestions);

                const reservedDates = _.difference(allDates, freeDates);

                res.json(reservedDates);
              }
            });
          }).
          catch(err => {
            console.log(err);
          });
      });
  });

  return router;
}

module.exports = suggestionsRouter;
