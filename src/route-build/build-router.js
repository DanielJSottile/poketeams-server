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
    const {user_id} = req.body;
    const { folder_name } = req.body;
    const newFolder = { folder_name, user_id };

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
  })
  .patch(dataParser, (req, res, next) => { // this works!
    const {id} = req.body;
    const { folder_name } = req.body;
    const folderUpdate = {folder_name: folder_name};

    for (const [key, value] of Object.entries(folderUpdate))
      if (value == null) {
        return res.status(400).json({error: `Missing '${key}' in request body`});
      }

    BuildService.patchUserFolder(req.app.get('db'), id, folderUpdate)
      .then(() => {
        res.status(204);
      })
      .catch(next);
  });

BuildRouter
  .route('/teams/:user_id')
  .all(requireAuth)
  .get((req, res, next) => { // this works!
    const {user_id} = req.params;
    BuildService.getUserTeams(req.app.get('db'), user_id)
      .then(teams => res.json(teams));
  })
  .post(dataParser, (req, res, next) => {
    const newTeam = req.body;
    for (const [key, value] of Object.entries(newTeam))
      if (value == null) {
        return res.status(400).json({error: `Missing '${key}' in request body`});
      }

    BuildService.postUserTeam(req.app.get('db'), newTeam)
      .then(set => {
        res.status(201).json(set);
      })
      .catch(next);
  })
  .patch(dataParser, (req, res, next) => { 
    const body = req.body;
    const id = body.id;
    const teamUpdate = {team_name: body.team_name, description: body.description};

    BuildService.patchUserTeam(req.app.get('db'), id, teamUpdate)
      .then(() => {
        res.status(204);
      })
      .catch(next);
  });

BuildRouter
  .route('/sets/:user_id')
  .all(requireAuth)
  .get((req, res, next) => { // this works!
    const {user_id} = req.params;
    BuildService.getUserSets(req.app.get('db'), user_id)
      .then(sets => res.json(sets));
  })
  .post(dataParser, (req, res, next) => {
    const newSet = req.body;
    // eliminate the check on values because we can have false and null values!

    BuildService.postUserSet(req.app.get('db'), newSet)
      .then(set => {
        res.status(201).json(set);
      })
      .catch(next);
  })
  .patch(dataParser, (req, res, next) => { 
    const body = req.body;
    const id = body.id;

    const setUpdate = {
      nickname: body.nickname,
      species: body.species,
      gender: body.gender,
      item: body.item,
      ability: body.ability,
      level: body.level,
      shiny: body.shiny,
      happiness: body.happiness,
      nature: body.nature,
      hp_ev: body.hp_ev,
      atk_ev: body.atk_ev,
      def_ev: body.def_ev,
      spa_ev: body.spa_ev,
      spd_ev: body.spd_ev,
      spe_ev: body.spe_ev,
      hp_iv: body.hp_iv,
      atk_iv: body.atk_iv,
      def_iv: body.def_iv,
      spa_iv: body.spa_iv,
      spd_iv: body.spd_iv,
      spe_iv: body.spe_iv,
      move_one: body.move_one,
      move_two: body.move_two,
      move_three: body.move_three,
      move_four: body.move_four,
    };

    BuildService.patchUserSet(req.app.get('db'), id, setUpdate)
      .then(() => {
        res.status(204);
      })
      .catch(next);
  });

BuildRouter
  .route('/folders/:user_id/filter/')
  .all(requireAuth)
  .get((req, res, next) => {
    const {user_id} = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserFoldersFilter(req.app.get('db'), user_id, sort, species)
      .then(folders => {
        if (!folders) {
          logger.error('Failed get folders!');
          return res.status(404).json({
            error: { message: 'There Are No Folders' }
          });
        }
        logger.info(
          'Successful get the folders!'
        );
        res.json(folders);
      })
      .catch(next);
  });

BuildRouter
  .route('/teams/:user_id/filter/')
  .all(requireAuth)
  .get((req, res, next) => {
    const {user_id} = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserTeamsFilter(req.app.get('db'), user_id, sort, species)
      .then(teams=> {
        if (!teams) {
          logger.error('Failed get teams!');
          return res.status(404).json({
            error: { message: 'There Are No Teams' }
          });
        }
        logger.info(
          'Successful get the folders!'
        );
        res.json(teams);
      })
      .catch(next);
  });

BuildRouter
  .route('/sets/:user_id/filter/')
  .all(requireAuth)
  .get((req, res, next) => {
    const {user_id} = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserSetsFilter(req.app.get('db'), user_id, sort, species)
      .then(sets => {
        if (!sets) {
          logger.error('Failed get sets!');
          return res.status(404).json({
            error: { message: 'There Are No sets' }
          });
        }
        logger.info(
          'Successful get the folders!'
        );
        res.json(sets);
      })
      .catch(next);
  });

module.exports = BuildRouter;