'use strict';

const express = require('express');
const config = require('config');
const moment = require('moment-business-days');

const Employee = require('../models/Employee');
const Business = require('../models/Business');

const { GoogleCalendar } = require('../../src/booking/calendars/google-calendar');
const { MessageReceived, PostbackReceived } = require('../../library/messenger/callbacks');
const { BookingAssistant } = require('../../src/booking');
const Batch = require('../../library/messenger/Batch');
const { Oracle } = require('../oracle');

const {
  BusyTimeException,
  OutsideWorkingTimeException,
  PastTimeException,
  UnsupportedDayFormat,
  UnsupportedTimeFormat
} = require('../../src/booking/exceptions');

const calendar = new GoogleCalendar(
  config.get('googleAppClientId'),
  config.get('googleAppClientSecret'),
  config.get('googleAppAuthURI')
);

calendar.setToken(
  config
  .get('googleApp')
  .get('users')
  .get('kamen_kolarov')
);

const assistant = new BookingAssistant(Employee, calendar);
const oracle = new Oracle();

var router = express.Router();

router.get('/booking/suggester', (err, res) => {
  const request = {
    calendarId: 'fetfjslqogof3759gph1krs0a4@group.calendar.google.com',
    sender: 'Kamen Kolarov',
    description: {
      phone: '+359 89 44 16 041',
      complaints: ['tooth_pain']
    },
    day: '11/12/2016',
    hour: '09:00',
    estimation: {
      hours: 1,
      minutes: 30
    }
  };

  assistant.suggest(request, (err, suggestions) => {
    if (!err) {
      console.log(suggestions);
    }
  });

  res.send('Hello World!');
});

router.get('/update_models', (req, res) => {
  let business = new Business({
    name: "Стамотологичен кабинет Д-р Йонов",
    domain : "дентална грижа",
    subscribe : "booking"
  });

  business.save((err, business) => {
    if (!err) {
      let employee = new Employee({
        name : "Д-р Йонов",
        position : "dentist",
        pictureUrl : "http://yonov.eu/wp-content/uploads/2016/08/DSCN1465-1.jpg",
        calendarId : "fetfjslqogof3759gph1krs0a4@group.calendar.google.com",
        _business : business._id,
        workingTime : {
          weekly: {
            start : "09:00", end : "18:00",
            active: true
          },
          holiday: {
            start : "09:00", end : "18:00",
            active: false
          }
        }
      });

      employee.save();
    }

    res.send('Update Business & Employee models');
  });
});

module.exports = router;
