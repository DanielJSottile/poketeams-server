const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const BuildRouter = express.Router();
const dataParser = express.json();
const BuildService = require('./build-service');

const serialize = item => ({
  
});

BuildRouter
  .route('/folders/:user_id')
  .get((req, res, next) => {
    const {user_id} = req.params;
    BuildService.getUserFolders(req.app.get('db'), user_id)
      .then(folders => res.json(folders));
  });

BuildRouter
  .route('/teams/:user_id')
  .get((req, res, next) => {
    const {user_id} = req.params;
    BuildService.getUserTeams(req.app.get('db'), user_id)
      .then(teams => res.json(teams));
  });

BuildRouter
  .route('/sets/:user_id')
  .get((req, res, next) => {
    const {user_id} = req.params;
    BuildService.getUserSets(req.app.get('db'), user_id)
      .then(folders => res.json(folders));
  });

module.exports = BuildRouter;