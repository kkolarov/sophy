'use strict';

const samples = (clientId) => {
  const message = 'For testing purposes';
  const quickReplies = [];

  return {
    getSampleWithMissingDentist: () => {
      return {
          recipientId: clientId,
          message: message,
          quickReplies: quickReplies,
          context: {
            dentist_step: true
          },
          metadata: {

          }
      };
    },
    getSampleWithMissingReason: () => {
      return {
          recipientId: clientId,
          message: message,
          quickReplies: quickReplies,
          context: {
            dentist: {},
            reason_step: true
          },
          metadata: {

          }
      };
    },
    getSampleWithMissingHour: () => {
      return {
        recipientId: clientId,
        message: message,
        quickReplies: quickReplies,
        context: {
          dentist: {},
          reason: {},
          hour_step: true
        },
        metadata: {

        }
      };
    },
    getSampleWithMissingDay: () => {
      return {
          recipientId: clientId,
          message: message,
          quickReplies: quickReplies,
          context: {
            dentist: {},
            reason: {},
            hour: '',
            day_step: true
          },
          metadata: {

          }
      };
    },
    getSampleWithReservation: () => {
      return {
        recipientId: clientId,
        message: message,
        quickReplies: quickReplies,
        context: {
          day: '2017-12-31',
          hour: '16:00',
          dentist: {},
          reason: {}
        },
        metadata: {

        }
      };
    }
  };
};

module.exports = samples;
