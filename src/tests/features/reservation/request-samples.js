'use strict';

const _ = require('lodash');
const moment = require('moment');
const config = require('config');

const samples = (function() {
  const prototype = {
    calendarId: config.calendars.id,
    sender: 'Kamen Kolarov',
    description: {
      phone: '+359 89 44 16 041',
      complaints: ['tooth_pain']
    },
    day: '',
    hour: '12:00',
    duration: {
      hours: 1,
      minutes: 30
    }
  };

  const tomorrow = () => {
    return moment().add(1, 'days').format(config.reservation.adapter.date.format.day);
  }

  const yesterday = () => {
    return moment().subtract(1, 'days').format(config.reservation.adapter.date.format.day);
  }

  return {
    getSampleWithInvalidDay: () => {
      let request = _.cloneDeep(prototype);

      request.day = 'das/dasdsa/ddd';
      return request;
    },
    getSampleWithInvalidHour: () => {
      let request = _.cloneDeep(prototype);

      request.day = tomorrow();
      request.hour = '16:dd';
      return request;
    },
    getSampleWithRequestResidesInPast: () => {
      let request = _.cloneDeep(prototype);

      request.day = yesterday();
      return request;
    },
    getSampleWithReservedHour: () => {
      let request = _.cloneDeep(prototype);

      request.day = tomorrow();
      return request;
    },
    getSampleWithRequestResidesOutsideWorkingTime: () => {
      let request = _.cloneDeep(prototype);

      request.hour = '21:00';
      request.day = tomorrow();
      return request;
    },
    getSampleWithValidRequest: () => {
      let request = _.cloneDeep(prototype);

      request.day = tomorrow();
      return request;
    }
  };
})();

module.exports = samples;