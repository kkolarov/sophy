'use strict';

const Prophecy = require('../../../oracle/Prophecy');

const samples = (function() {
  const clientId = 1112292508879017; // sophia.virtual.assistant@gmail.com
  const message = 'For testing purposes';
  const quickReplies = [];

  return {
    getSampleWithMissingDentist: () => {
      return new Prophecy(
        clientId,
        message,
        quickReplies,
        {
          dentist_step: true
        }
      );
    },
    getSampleWithMissingReason: () => {
      return new Prophecy(
        clientId,
        message,
        quickReplies,
        {
          reason_step: true
        }
      );
    },
    getSampleWithMissingDay: () => {
      return new Prophecy(
        clientId,
        message,
        quickReplies,
        {
          day_step: true
        }
      );
    },
    getSampleWithMissingHour: () => {
      return new Prophecy(
        clientId,
        message,
        quickReplies,
        {
          hour_step: true
        }
      );
    },
    getSampleWithSuggestions: () => {
      return new Prophecy(
        clientId,
        message,
        quickReplies,
        {
          suggestion_step: true,
          suggestions: ['12/30/2016 15:00', '12/31/2016 16:00'],
          dentist: {
            pictureUrl: 'http://yonov.eu/wp-content/uploads/2016/08/DSCN1465-1.jpg'
          }
        }
      );
    },
    getSampleWithReservation: () => {
      return new Prophecy(
        clientId,
        message,
        quickReplies,
        {
          day: '12/31/2016',
          hour: '16:00',
          dentist: {},
          reason: {}
        }
      );
    }
  };
})();

module.exports = samples;
