const express = require('express');
const logger = require('morgan');

const baseRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', baseRouter);

module.exports = app;
