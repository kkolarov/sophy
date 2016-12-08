'use strict';

const express = require('express');
const config = require('config');
const moment = require('moment-business-days');
const request = require('request');
const Employee = require('../models/Employee');
const Business = require('../models/Business');
const User = require('../models/User');

const { GoogleCalendar } = require('../../src/booking/calendars/google-calendar');
const { BookingAssistant } = require('../../src/booking');
const { Oracle } = require('../oracle');

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

router.get('/user_model', (req, res) => {
  // Employee.findEmoloyees(10)
  //   .then(employees => {
  //     console.log(employees);
  //   });


  console.log(config.get('messenger_templates').get('suggestions').get('mandatoryCards')[0]);

  // User.findOrCreateFbUser(1112292508879017, (err, user) => {
  //   if (!err) {
  //     console.log(user);
  //   } else {
  //     console.log(err);
  //   }
  // });

  // const info = {
  //   first_name: 'Kamen',
  //   last_name: 'Kolarov',
  //   profile_pic: 'https://scontent.xx.fbcdn.net/t31.0-1/p720x720/10506738_10150004552801856_220367501106153455_o.jpg',
  //   locale: 'en_GB',
  //   timezone: 2,
  //   gender: 'male'
  // };

  // const user = new User({
  //   fbUserId: 1112204632166184,
  //   firstName: info.first_name || '',
  //   lastName: info.last_name || '',
  //   pictureUrl: info.profile_pic || '',
  //   locale: info.locale || '',
  //   timezone: info.timezone || '',
  //   gender: info.gender || ''
  // });
  //
  // user.save((err, user) => {
  //   console.log(user);
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
    name: "Стамотологичен кабинет ...",
    domain : "дентална грижа",
    subscribe : "booking"
  });

  business.save((err, business) => {
    if (!err) {
      let employee1 = new Employee({
        name : 'Д-р Йонов',
        position : 'dentist',
        pictureUrl : 'http://yonov.eu/wp-content/uploads/2016/08/DSCN1465-1.jpg',
        calendarId : 'fetfjslqogof3759gph1krs0a4@group.calendar.google.com',
        aboutMe: 'Моята мисия е да предоставя висококачествено дентално лечение в съответствие с ценностите, заложени в Хипократовата клета.',
        _business : business._id,
        workingTime : {
          weekly: {
            start : '09:00', end : '18:00',
            active: true
          },
          holiday: {
            start : '09:00', end : '18:00',
            active: true
          }
        }
      });

      employee1.save();

      let employee2 = new Employee({
        name : "Д-р Митева",
        position : "dentist",
        pictureUrl : "http://dentaconsult.bg/data//uploads/media/team/6/C_52c47914c23cbda62fb9d981aa821775.jpg",
        calendarId : "",
        aboutMe: 'Тя е нежното лице на Denta Consult и e доказателство, че във всеки дом има по една жена, която знае как да му вдъхне живот.',
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

      let employee3 = new Employee({
        name : 'Д-р Маринов',
        position : 'dentist',
        pictureUrl : 'http://dentaconsult.bg/data//uploads/media/team/4/C_14f3ceb179b8ff62025759ef52a79976.jpg',
        calendarId : '',
        aboutMe: 'Той разбива мита, че рутината задължително върви в комплект с бели коси и дълбоки бръчки.',
        workingTime : {
          weekly: {
            start : '09:00', end : '18:00',
            active: true
          },
          holiday: {
            start : '09:00', end : '18:00',
            active: true
          }
        }
      });

      employee1.save();
      employee2.save();
      employee3.save();
    }

    res.send('Update Business & Employee models');
  });
});

module.exports = router;
