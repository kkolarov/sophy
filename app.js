'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const config = require('config');

const { pickerRoute, apiRoute, testRoute } = require('./src/routes');

var app = express();

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api', apiRoute);
app.use('/picker', pickerRoute);
app.use('/test', testRoute);

console.log("TEST");

mongoose.connect(config.get('database').get('mongoUri'));

app.listen(config.get('port'));
