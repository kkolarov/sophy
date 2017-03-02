# Sophy [![Build Status](https://travis-ci.com/fanatic42/sophy.svg?token=yiwT9utGSLvfkSnTbVXG&branch=master)](https://travis-ci.com/fanatic42/sophy)

Sophy is a virtual assistant (bot) for booking.

![Image of Sherloc](https://dl.dropboxusercontent.com/u/108059564/medical_check.jpg)


## Requisite

* Facebook page - The Facebook App contains the settings. This is where you will setup your webhook, retrieve your page access token and submit your app for approval.
* [Facebook app](https://developers.facebook.com/apps) - A Facebook Page will be used as the identity of your VA. When people chat with your VA, they will see the Page name and the Page profile pic.
* [Ngrok](https://ngrok.com) - Ngrok allows you to expose a web server running on your local machine to the internet.
* [Wit](https://wit.ai) - Wit.ai helps you parse a message into structured data (Understand) or predict the next action your bot should perform (Converse). 
* [Nodejs](https://nodejs.org) ~v6.0
* [Mongodb](https://www.mongodb.com/download-center?jmp=nav#community) ~v3.2

## Installation

You have to install project dependencies via the commands:

`npm install` and `bower install`.

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

To run the project, you have to preprare a configuration file. You need development.json in the config folder with the following structure:

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
To make appointments in your Google calendars, the VA should have access to them using the `GOOGLE_SOPHY_ACCESS_TOKEN` token.

You can generate this kind of token using the script quickstart.js. If you cannot find it out, you can contact the project owner.

The VA is capable to converse with clients using Wit's bot engine. After creating an app there, go to the settings section, get the access token and assign it to the `WIT_ACCESS_TOKEN` property.

After creating a fb app, go to the dashboard section, copy the app secret and assign it to the `FACEBOOK_APP_SECRET` property.

## Usage
