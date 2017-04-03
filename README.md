### <p align="center"><img width="150px" height="150px" src="https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-9/17553949_615473718638702_8401331221913396484_n.png?oh=38bf43137d3b173555ff3db4cc93e1a4&oe=59591393"></p>

# [Sophy](https://m.me/sophy.virtual.assistant) [![Build Status](https://travis-ci.com/kkolarov/sophy.svg?token=yiwT9utGSLvfkSnTbVXG&branch=master)](https://travis-ci.com/kkolarov/sophy)

*Sophy is a personalized bot intended to make reservations through the FB Messenger.*

### [Live](https://m.me/sophy.virtual.assistant)


## Requisite

`Step 1` - A facebook page which serves as an identity of your bot.

`Step 2` - A facebook app that links a facebook page with your bot.

`Step 3` - A [ngrok](https://ngrok.com) account

`Step 4` - A [wit](https://wit.ai/) account

`Step 5` - [Nodejs](https://nodejs.org/en/)

`Step 6` - [Mongodb](https://www.mongodb.com/)

## Installation

`Step 1` - clone the repo

```bash
$ git clone https://github.com/fanatic42/sophy.git
```

`Step 2` - cd in the repo

```bash
$ cd sophy
```

`Step 3` - install dependencies

```bash
$ npm install
```

```bash
$ bower install
```

## Configuration

### Facebook app

`Step 1` - Create Secure Tunneling to Your Localhost

```bash
$ ngrok http 3000
```
This command creates two public accessed URLs forwarding to your localhost on port 3000. Lets assume that the URLs are:
- http://a63e0ca6.ngrok.io
- https://a63e0ca6.ngrok.io

For clarity, lets allow the https://a63e0ca6.ngrok.io URL being aliased with `YOUR_NGROK_URL`.

`Step 2` - Setup a Webhook

Webhook is a HTTP callback used to send you a variety of different events including messages, authentication events and callback events from messages.

In the `Webhook` section, enter the `YOUR_NGROK_URL` at which your bot will receive messages. Also, add code verification, filling out the `fortestingpurposes` value.

There are different types of messages sent by the Messenger so lets select `message_deliveries`, `messages`, `messaging_postbacks` and `messaging_referrals`.

Finally, click on `Verify and Save` button in the `New Page Subscription` to call the webhook with a GET request.

![Image of Webhook](https://scontent.fsof3-1.fna.fbcdn.net/v/t39.2365-6/13509161_1641776279476564_1943134593_n.png?oh=f47fd7125ebc77f5de9489d536e431f2&oe=596F73E3)

`Step 3` - Subscribe the App to a Page

In the `Webhooks` section, you can subscribe the webhook for a specific page.

![Image of Webhook](https://scontent.fsof3-1.fna.fbcdn.net/v/t39.2365-6/13503523_1380281451999079_606965217_n.png?oh=27144d208274773ad47513888374277a&oe=596D669C)

`Step 4` - Get a Page Access Token

In the `Token Generation` section, select your Page. A Page Access Token will be generated for you.

Note: The generated token will NOT be saved in this UI. Each time you select that Page a new token will be generated. However, any previous tokens created will continue to function.

`Step 5` - Sophy Configuration File

Lets look at the structure of the `development.json` file:

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
- `GOOGLE_SOPHY_ACCESS_TOKEN` token - This token helps you to make a reservation in your Google calendars. You can generate it by running the script `quickstart.js`.
- `WIT_ACCESS_TOKEN` token - This token helps you to access your bot model through Wit. You can find it out by visiting the `Settings` section in your Wit account.
- `FACEBOOK_APP_SECRET` token - You can find it out by visiting the `Dashboard` section in your facebook app.

## Usage

Lets assume that you are in the root folder of the project. The command that bootstraps the bot is as simple as

```bash
$ gulp
```

Now your bot is listening on localhost:3000.

## Main Features

- [x] - making a reservation in a Google calendar.

- [ ] - canceling a reservation in a Google calendar.

- [ ] - reminder that notifies users when the upcoming hour comes.

- [ ] - real time tracker that keep track of the location of users.

<p align="center">
  <sub>If you found a bug or some improvments, feel free to raise an issue and send a PR!</sub>
</p>
