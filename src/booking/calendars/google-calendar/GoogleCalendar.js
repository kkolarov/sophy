'use strict';

const google = require('googleapis');
const googleAuth = require('google-auth-library');

const colors = require('./event-colors');

/**
*
* @author Kamen Kolarov
*/
class GoogleCalendar {

  constructor(clientId, clientSecret, redirectUri) {
    let auth = new googleAuth();

    this._oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUri);
    this._calendar = google.calendar('v3');
  }

  setToken(token) {
    this._oauth2Client.credentials = {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      token_type: token.token_type,
      expiry_date: token.expiry_date
    };
  }

  getEventColors() {
    return colors;
  }

  deleteEvent(calendarId, eventId) {
    return new Promise((resolve, reject) => {
      const parameters = {
        auth: this._oauth2Client,
        calendarId: calendarId,
        eventId: eventId,
      };

      this._calendar.events.delete(parameters, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  }

  deleteEvents(calendarId, date) {
    let that = this;

    return new Promise((resolve, reject) => {
      that.getEvents(calendarId, date).then((events) => {
        let promises = [];

        for (let i = 0; i < events.length; ++i) {
          let event = events[i];
          let promise = that.deleteEvent(calendarId, event.id);

          promises.push(promise);
        }

        Promise.all(promises).then(response => {
          resolve(true);
        }).catch(exception => {
          reject(exception);
        });
      });
    });
  }

  getEvents(calendarId, date) {
    return new Promise((resolve, reject) => {
      const parameters = {
        auth: this._oauth2Client,
        calendarId: calendarId,
        timeMin: date.start.toISOString(),
        timeMax: date.end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      };

      this._calendar.events.list(parameters, (err, res) => {
        if (!err) {
          let events = [];
          for (let i = 0; i < res.items.length; ++i) {
            let item = res.items[i];

            events.push({
              id: item.id || '',
              sender: item.summary || '',
              description: item.description || '',
              colorId: item.colorId || '',
              date: {
                start: item.start.dateTime || '',
                end: item.end.dateTime || ''
              }
            })
          }

          resolve(events);

        } else {
          reject(err);
        }
      });
    });
  }

  createEvent(calendarId, event, cb) {
    return new Promise((resolve, reject) => {
      const parameters = {
        auth: this._oauth2Client,
        calendarId: calendarId,
        resource: {
          summary: event.sender,
          description: event.description,
          colorId: event.colorId,
          start: {
            dateTime: event.date.start
          },
          end: {
            dateTime: event.date.end
          }
        }
      };

      this._calendar.events.insert(parameters, (err, res) => {
        if (!err) {
          event.id = res.id;
          resolve(event);
        } else {
          reject(err);
        }
      });
    });
  }
}

module.exports = GoogleCalendar;
