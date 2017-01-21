'use strict';

const express = require('express');

const User = require('../models/User');

function conversationsRouter(conversationManager) {
  const router = express.Router();

  router.get('/:userId', (req, res) => {
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
    // };
    //
    // res.json(context);

    conversationManager.findConversationByUserId(req.params.userId)
      .then(conversation => {
        if (conversation) {
          res.json(conversation.context);
        } else {
          res.json({});
        }
      });
  });

  return router;
}

module.exports = conversationsRouter;
