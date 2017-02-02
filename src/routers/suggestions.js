'use strict';

const express = require('express');
const config = require('config');
const moment = require('moment');
const _ = require('lodash');

const { DentalVisitEstimator } = require('../reservation/estimators');
const estimator = new DentalVisitEstimator();

const getAllDatesArray = () => {
  const maxDays = config.reservation.maxDays;

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
* @param Object logger
*
* @return Router
*/
const suggestionsRouter = (assistant, manager, logger) => {
  const router = express.Router();

  router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    manager.findConversationByUserId(userId)
      .then(conversation => {
        const context = conversation.context;

        return estimator.estimate(context)
          .then(duration => {
            const today = moment(new Date()).format('YYYY-MM-DD');

            const request = {
              calendarId: context.dentist.calendarId,
              sender: context.recipient.name,
              day: today,
              hour: context.hour,
              duration: duration
            };

            return assistant.suggest(request)
              .then(suggestions => {
                const allDates = getAllDatesArray();
                const freeDates = getFreeDatesArray(suggestions);

                const reservedDates = _.difference(allDates, freeDates);

                res.json(reservedDates);
              });
          });
      }).catch(err => {
        if (err instanceof Error) {
          logger.error(err.stack);
        }
      });
  });

  return router;
}

module.exports = suggestionsRouter;
