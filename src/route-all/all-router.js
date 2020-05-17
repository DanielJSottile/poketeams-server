const express = require('express');
const logger = require('./logger');
const xss = require('xss');
const AllRouter = express.Router();
const dataParser = express.json();
const AllService = require('./all-service');

const serialize = item => ({
  
});

AllRouter
  .route('/')
  .get((req, res, next) => {
    AllService.getAll___(req.app.get('db'))
      .then(item => res.json(item));
  });

module.exports = AllRouter;