const express = require('express');
const logger = require('./logger');
const xss = require('xss');
const BuildRouter = express.Router();
const dataParser = express.json();
const BuildService = require('./build-service');

const serialize = item => ({
  
});

BuildRouter
  .route('/')
  .get((req, res, next) => {
    BuildService.getAll___(req.app.get('db'))
      .then(item => res.json(item));
  });

module.exports = BuildRouter;