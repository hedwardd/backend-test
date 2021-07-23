const express = require('express');

const usersRouter = require('./users');
const testRouter = require('./test');

const baseRouter = express.Router();

baseRouter.use('/test', testRouter);
baseRouter.use('/users', usersRouter);

module.exports = baseRouter;
