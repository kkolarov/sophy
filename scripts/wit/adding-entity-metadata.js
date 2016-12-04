#!/usr/bin/env node

const request = require('request');

const duration = {
  duration: {
    hours: 0,
    minutes: 30
  }
}

request({
  uri: 'https://api.wit.ai/entities/reason?v=20160526',
  qs: { access_token: '' },
  method: 'PUT',
  json: {
    values: [
      {
        value: "Профилактичен преглед",
        expressions: ["Профилактичен преглед"],
        metadata: JSON.stringify(duration)
      }
    ]
  }
}, (err, res) => {
  console.log(res.body);
});
