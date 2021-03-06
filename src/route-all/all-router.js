const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const AllRouter = express.Router();
const AllService = require('./all-service');
// temporary for now?
const BuildService = require('../route-build/build-service');

// Sanitization

const sanitizeFolder = (folder) => ({
  id: folder.id,
  folder_name: xss(folder.folder_name),
  user_id: folder.user_id,
  date_created: xss(folder.date_created),
  date_modified: xss(folder.date_modified),
});

const sanitizeTeam = (team) => ({
  id: team.id,
  team_name: xss(team.team_name),
  description: xss(team.description),
  date_created: xss(team.date_created),
  date_modified: xss(team.date_modified),
  user_id: team.user_id,
  user_name: xss(team.user_name),
  folder_id: team.folder_id,
  folder_name: xss(team.folder_name),
});

const sanitizeSet = (set) => ({
  id: set.id,
  team_name: xss(set.team_name),
  description: xss(set.description),
  date_created: xss(set.date_created),
  date_modified: xss(set.date_modified),
  user_id: set.user_id,
  user_name: xss(set.user_name),
  folder_id: set.folder_id,
  folder_name: xss(set.folder_name),
  nickname: xss(set.nickname),
  species: xss(set.species),
  gender: xss(set.gender),
  item: xss(set.item),
  ability: xss(set.ability),
  level: set.level,
  shiny: set.shiny,
  happiness: set.happiness,
  nature: xss(set.nature),
  hp_ev: set.hp_ev,
  atk_ev: set.atk_ev,
  def_ev: set.def_ev,
  spa_ev: set.spa_ev,
  spd_ev: set.spd_ev,
  spe_ev: set.spe_ev,
  hp_iv: set.hp_iv,
  atk_iv: set.atk_iv,
  def_iv: set.def_iv,
  spa_iv: set.spa_iv,
  spd_iv: set.spd_iv,
  spe_iv: set.spe_iv,
  move_one: xss(set.move_one),
  move_two: xss(set.move_two),
  move_three: xss(set.move_three),
  move_four: xss(set.move_four),
  team_id: set.team_id,
});

// Folder

AllRouter.route('/folderpublic/:folder_id') // Get a single Folder by ID
  .get((req, res, next) => {
    const { folder_id } = req.params;
    BuildService.getSingleUserFolderById(req.app.get('db'), folder_id)
      .then((folder) => {
        if (!folder) {
          logger.error(`Failed get folder with id: ${folder_id}`);
          return res.status(404).json({
            error: { message: "folder doesn't exist" },
          });
        }
        logger.info(
          `Successful get : folder ${folder.folder_name} was retrieved with id: ${folder.id}`
        );
        res.json(sanitizeFolder(folder[0]));
      })
      .catch(next);
  });

// Teams

AllRouter.route('/:folder_id/teams') // Gets the Teams for an individual Folder, used for the public view.
  .get((req, res, next) => {
    const { folder_id } = req.params;
    AllService.getTeamsForIndividualFolder(req.app.get('db'), folder_id)
      .then((teams) => {
        if (!teams) {
          logger.error('Failed get teams for folder!');
          return res.status(404).json({
            error: { message: 'There probably isnt this folder' },
          });
        }
        logger.info('Successful get teams for individual folder!');
        res.json(teams.map((team) => sanitizeTeam(team)));
      })
      .catch(next);
  });

AllRouter.route('/search') // Get 10 teams with a search
  .get((req, res, next) => {
    const page = Number(req.query.page);
    const sort = req.query.sort;
    const species = req.query.species;
    AllService.getTenTeamsWithSearch(req.app.get('db'), page, sort, species)
      .then((teams) => {
        if (!teams) {
          logger.error('Failed get teams!');
          return res.status(404).json({
            error: { message: 'There Are No Teams' },
          });
        }
        logger.info('Successful get 10 teams!');
        res.json(teams.map((team) => sanitizeTeam(team)));
      })
      .catch(next);
  });

AllRouter.route('/:team_id') // Get a team by it's ID
  .get((req, res, next) => {
    const { team_id } = req.params;
    AllService.getTeamById(req.app.get('db'), team_id)
      .then((team) => {
        if (!team[0]) {
          logger.error(`Failed get team with id: ${team_id}`);
          return res.status(404).json({
            error: { message: "Team doesn't exist" },
          });
        }
        logger.info(
          `Successful get : team ${team[0].team_name} was retrieved with id: ${team[0].id}`
        );
        res.json(sanitizeTeam(team[0]));
      })
      .catch(next);
  });

// Sets

AllRouter.route('/:team_id/sets') // Gets the Sets for an individual Team, used for the public view.
  .get((req, res, next) => {
    const { team_id } = req.params;
    AllService.getSetsForIndividualTeam(req.app.get('db'), team_id)
      .then((sets) => {
        if (!sets) {
          logger.error('Failed get sets for teams!');
          return res.status(404).json({
            error: { message: 'There probably isnt this team' },
          });
        }
        logger.info('Successful get sets for individual team!');
        res.json(sets.map((set) => sanitizeSet(set)));
      })
      .catch(next);
  });

AllRouter.route('/set/:set_id') // Get a team by it's ID
  .get((req, res, next) => {
    const { set_id } = req.params;
    AllService.getSetById(req.app.get('db'), set_id)
      .then((set) => {
        if (!set[0]) {
          logger.error(`Failed get set with id: ${set_id}`);
          return res.status(404).json({
            error: { message: "Set doesn't exist" },
          });
        }
        logger.info(
          `Successful get : set ${set[0].set_name} was retrieved with id: ${set[0].id}`
        );
        res.json(sanitizeSet(set[0]));
      })
      .catch(next);
  });

module.exports = AllRouter;
