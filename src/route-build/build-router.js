const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const BuildRouter = express.Router();
const dataParser = express.json();
const BuildService = require('./build-service');
const {requireAuth} = require('../middleware/jwt-auth');

const serialize = item => ({
  
});

BuildRouter
  .route('/folders/:user_id')
  .all(requireAuth)
  .get((req, res, next) => { // this works!
    const {user_id} = req.params;
    BuildService.getUserFolders(req.app.get('db'), user_id)
      .then(folders => res.json(folders)).catch(next);
  })
  .post(dataParser, (req, res, next) => { // this works!
    const {user_id} = req.params;
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    for (const [key, value] of Object.entries(newFolder))
      if (value == null) {
        return res.status(400).json({error: `Missing '${key}' in request body`});
      }
    newFolder.user_id = user_id;

    BuildService.postUserFolder(req.app.get('db'), newFolder)
      .then(folder => {
        res.status(201).json(folder);
      })
      .catch(next);
  });

BuildRouter
  .route('/teams/:user_id')
  //.all(requireAuth)
  .get((req, res, next) => { // this works!
    const {user_id} = req.params;
    BuildService.getUserTeams(req.app.get('db'), user_id)
      .then(teams => res.json(teams));
  })
  .post(dataParser, (req, res, next) => { 
    const { team_name, description } = req.body;
    const newTeam = { team_name, description };

    for (const [key, value] of Object.entries(newTeam))
      if (value == null) {
        return res.status(400).json({error: `Missing '${key}' in request body`});
      }
    newTeam.folder_id = req.folder.id; // does this even work

    BuildService.postUserTeam(req.app.get('db'), newTeam)
      .then(team => {
        res.status(201).json(team);
      })
      .catch(next);
  });

BuildRouter
  .route('/sets/:user_id')
  .all(requireAuth)
  .get((req, res, next) => { // this works!
    const {user_id} = req.params;
    BuildService.getUserSets(req.app.get('db'), user_id)
      .then(folders => res.json(folders));
  })
  .post(dataParser, (req, res, next) => {
    const { 
      nickname,
      species,
      gender,
      item,
      ability,
      level,
      shiny,
      happiness,
      nature,
      hp_ev,
      atk_ev,
      def_ev,
      spa_ev,
      spd_ev,
      spe_ev,
      hp_iv,
      atk_iv,
      def_iv,
      spa_iv,
      spd_iv,
      spe_iv,
      move_one,
      move_two,
      move_three,
      move_four
    } = req.body;
    const newSet = { 
      nickname,
      species,
      gender,
      item,
      ability,
      level,
      shiny,
      happiness,
      nature,
      hp_ev,
      atk_ev,
      def_ev,
      spa_ev,
      spd_ev,
      spe_ev,
      hp_iv,
      atk_iv,
      def_iv,
      spa_iv,
      spd_iv,
      spe_iv,
      move_one,
      move_two,
      move_three,
      move_four
    };

    for (const [key, value] of Object.entries(newSet))
      if (value == null) {
        return res.status(400).json({error: `Missing '${key}' in request body`}); //will this go nuts because sometimes null values are wanted?  wat do
      }
    newSet.team_id = req.team.id; //again, does it work like this?

    BuildService.postUserFolder(req.app.get('db'), newSet)
      .then(folder => {
        res.status(201).json(folder);
      })
      .catch(next);
  });

module.exports = BuildRouter;