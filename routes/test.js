const express = require('express');

const testRouter = express.Router();

testRouter.get('/', (req, res) => {
  console.log('Test route hit.');
  res.json({ Message: 'Success.' });
});

module.exports = testRouter;
