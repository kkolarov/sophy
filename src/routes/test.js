'use strict';

const express = require('express');
const config = require('config');
const moment = require('moment-business-days');
const request = require('request');
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

router.get('/book', (req, res) => {

  console.log(moment(new Date("11/27/2016 16:00")).weekday());

  // const request = {
  //   calendarId: 'fetfjslqogof3759gph1krs0a4@group.calendar.google.com',
  //   sender: 'Kamen Kolarov',
  //   description: { phone: '', complaints: 'Профилактичен преглед' },
  //   day: '11/23/2016',
  //   hour: '16:00',
  //   estimation: { hours: 1, minutes: 30 }
  // };
  //
  // assistant.book(request, (exception, date) => {
  //   if (!exception) {
  //     console.log(date);
  //   } else {
  //     console.log(exception);
  //   }
  // });

  res.send('Hello World');
});

router.get('/get_started_button', (req, res) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: 'EAAFZA1E1YsYUBADZCZAcFHbQYwgXMSosteP5JpCSZCtZAQk4qS6COfrGVPUwB60TfWwES5lMVCSW7LDDU7yua2ZAP6JcISBUYlvHHqTvzJtZA2IJpcaE3Ifz5g7ItmlxcF8eKkqujePLhTxwy4IGMgNvhnpe2aNFHpGTTewrVZAyIQZDZD' },
    method: 'POST',
    json: {
      setting_type:"call_to_actions",
      thread_state:"new_thread",
      call_to_actions: [
        {
          type: "postback",
          title:"Запазване на час",
          payload:"Искам да си запиша час"
        }
      ]
    }
  }, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body);
    } else {
      console.log(body);
    }
  });

  res.send("Hello World");
});

router.get('/greeting_text', (req, res) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: 'EAAFZA1E1YsYUBADZCZAcFHbQYwgXMSosteP5JpCSZCtZAQk4qS6COfrGVPUwB60TfWwES5lMVCSW7LDDU7yua2ZAP6JcISBUYlvHHqTvzJtZA2IJpcaE3Ifz5g7ItmlxcF8eKkqujePLhTxwy4IGMgNvhnpe2aNFHpGTTewrVZAyIQZDZD' },
    method: 'POST',
    json: {
      setting_type:"greeting",
      greeting:{
        text:"Здравей {{user_first_name}}, казвам се Sophy и ще ти помогна да си запишеш час бързо и лесно!"
      }
    }
  }, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body);
    } else {
      console.log(body);
    }
  });

  res.send("Hello World");
});


router.get('/whitelist', (req, res) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: 'EAAFZA1E1YsYUBADZCZAcFHbQYwgXMSosteP5JpCSZCtZAQk4qS6COfrGVPUwB60TfWwES5lMVCSW7LDDU7yua2ZAP6JcISBUYlvHHqTvzJtZA2IJpcaE3Ifz5g7ItmlxcF8eKkqujePLhTxwy4IGMgNvhnpe2aNFHpGTTewrVZAyIQZDZD' },
    method: 'POST',
    json: {
      "setting_type" : "domain_whitelisting",
      "whitelisted_domains" : ["https://sophy.ngrok.io"],
      "domain_action_type": "add"
    }
  }, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body);
    } else {
      console.log(body);
    }
  });

  res.send("Hello World");
});

router.get('/persistant_menu', (req, res) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: 'EAAFZA1E1YsYUBADZCZAcFHbQYwgXMSosteP5JpCSZCtZAQk4qS6COfrGVPUwB60TfWwES5lMVCSW7LDDU7yua2ZAP6JcISBUYlvHHqTvzJtZA2IJpcaE3Ifz5g7ItmlxcF8eKkqujePLhTxwy4IGMgNvhnpe2aNFHpGTTewrVZAyIQZDZD' },
    method: 'POST',
    json: {
      setting_type : "call_to_actions",
      thread_state : "existing_thread",
      call_to_actions:[
        {
          type: "postback",
          title: "Искам да си запиша час",
          payload: "Искам да си запиша час при зъболекар"
        }
      ]
    }
  }, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body);
    } else {
      console.log(body);
    }
  });

  // request({
  //   uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
  //   qs: { access_token: 'EAAFZA1E1YsYUBADZCZAcFHbQYwgXMSosteP5JpCSZCtZAQk4qS6COfrGVPUwB60TfWwES5lMVCSW7LDDU7yua2ZAP6JcISBUYlvHHqTvzJtZA2IJpcaE3Ifz5g7ItmlxcF8eKkqujePLhTxwy4IGMgNvhnpe2aNFHpGTTewrVZAyIQZDZD' },
  //   method: 'DELETE',
  //   json: {
  //     setting_type : "call_to_actions",
  //     thread_state : "existing_thread"
  //   }
  // }, (err, res, body) => {
  //   if (!err && res.statusCode == 200) {
  //     console.log(body);
  //   } else {
  //     console.log(body);
  //   }
  // });

  res.send("Hello World");
});


router.get('/booking/suggester', (req, res) => {
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
            active: true
          }
        }
      });

      employee.save();
    }

    res.send('Update Business & Employee models');
  });
});

module.exports = router;
