### <p align="center"><img width="150px" height="150px" src="https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-9/17553949_615473718638702_8401331221913396484_n.png?oh=38bf43137d3b173555ff3db4cc93e1a4&oe=59591393"></p>

# [Sophy](https://m.me/sophy.virtual.assistant) [![Build Status](https://travis-ci.com/fanatic42/sophy.svg?token=yiwT9utGSLvfkSnTbVXG&branch=master)](https://travis-ci.com/fanatic42/sophy)

*Sophy is a bot intended to make reservations through the FB Messenger.*

### [Live](https://m.me/sophy.virtual.assistant)


## Requisite

`Step 1` - A facebook page which serves as an identity of your bot. 

`Step 2` - A facebook app that contains the settings especially those about the webhooks.

`Step 3` - A [ngrok](https://ngrok.com) account

`Step 4` - A [wit](https://wit.ai/) account

`Step 5` - [Nodejs](https://nodejs.org/en/)

`Step 6` - [Mongodb](https://www.mongodb.com/)

## Installation

#### `Step 1` - clone the repo
  
```bash
$ git clone https://github.com/fanatic42/sophy.git
```

#### `Step 2` - cd in the repo

```bash
$ cd sophy
```

#### `Step 3` - install dependencies

```bash
$ npm install 
```

```bash
$ bower install 
```

## Configuration

### Facebook app

#### Subscribe the App to a Page

In order for your webhook to receive events for a specific page, you must subscribe your app to the page. You can do this in the Webhooks section under the Messenger Tab.

![Image of Webhook](https://scontent.fsof3-1.fna.fbcdn.net/v/t39.2365-6/13503523_1380281451999079_606965217_n.png?oh=27144d208274773ad47513888374277a&oe=596D669C)

#### Setup a Webhook

Webhooks are used to send you a variety of different events including messages, authentication events and callback events from messages.

In the Messenger Platform tab, find the Webhooks section and click Setup Webhooks. Enter a URL for a webhook, define a Verify Token and select message_deliveries, messages, messaging_postbacks, messaging_referrals.

![Image of Webhook](https://scontent.fsof3-1.fna.fbcdn.net/v/t39.2365-6/13509161_1641776279476564_1943134593_n.png?oh=f47fd7125ebc77f5de9489d536e431f2&oe=596F73E3)

At your webhook URL, add code for verification. Your code should expect the Verify Token you previously defined, and respond with the challenge sent back in the verification request. Click the "Verify and Save" button in the New Page Subscription to call your webhook with a GET request.

### Sophy

To run the project, you have to prepare a configuration file. You need development.json in the config folder with the following structure:

```
{
  "environment": {
    "ALLOW_CONFIG_MUTATIONS": true,
    "MONGO_URI": "mongodb://localhost/sophy",
    "PORT": 3000,
    "FACEBOOK_APP_SECRET": "",
    "PAGE_VALIDATION_TOKEN": "fortestingpurposes",
    "GOOGLE_APP_ID": "244265190247-fjlc7h4261bkusanrhah43j725nodorr.apps.googleusercontent.com",
    "GOOGLE_APP_SECRET": "",
    "GOOGLE_SOPHY_ACCESS_TOKEN": "",
    "GOOGLE_SOPHY_REFRESH_TOKEN": "",
    "GOOGLE_SOPHY_TOKEN_TYPE": "",
    "GOOGLE_SOPHY_EXPIRY_DATE": ,
    "WIT_ACCESS_TOKEN": "",
    "CALENDAR_ID": "@group.calendar.google.com",
    "TIME_PICKER_WEBVIEW": "YOUR_NGROK_URL/pickers/time",
    "DAY_PICKER_WEBVIEW": "YOUR_NGROK_URL/pickers/day",
    "GOOGLE_MAPS_WEBVIEW": "YOUR_NGROK_URL/maps/google",
    "FALLBACK_URL": "YOUR_NGROK_URL/pickers/support",
    "CONVERSATION_MANAGER_PATH": "@fanatic/conversations/NativeConversationManager",
    "PREDICTION_LOG_LEVEL": "debug",
    "RESERVATION_LOG_LEVEL": "debug",
    "CONVERSATION_LOG_LEVEL": "debug",
    "ROUTE_LOG_LEVEL": "debug",
    "MESSAGE_LOG_LEVEL": "debug",
    "INTERPRETATION_LOG_LEVEL": "debug",
    "REPLY_LOG_LEVEL": "debug"
  }
}
```

You make appointments in your Google calendars using `GOOGLE_SOPHY_ACCESS_TOKEN` token. You can generate it as you run the script `quickstart.js` located at the top level of the project structure.

Sophy understands the user's response using Wit's bot engine. You can find the authorization token in the settings section. You have to copy and paste it in the `WIT_ACCESS_TOKEN` property.

The last property you have to configure is `FACEBOOK_APP_SECRET`. You can find it out by visiting the dashboard section in the facebook app.

## Usage
