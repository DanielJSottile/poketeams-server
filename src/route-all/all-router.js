const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const AllRouter = express.Router();
const dataParser = express.json();
const AllService = require('./all-service');

const sanitizeTeams = teams => ({
  
});

const sanitizeTeam = team => ({

});

const sanitizeSet = set => ({

});

AllRouter // get 10 public teams, default upon loading
  .route('/')
  .get((req, res, next) => {
    const page = Number(req.query.page);
    AllService.getTenTeamsDefault(req.app.get('db'), page)
      .then(teams => {
        if (!teams) {
          logger.error('Failed get teams!');
          return res.status(404).json({
            error: { message: 'There Are No Teams' }
          });
        }
        logger.info(
          'Successful get 10 teams!'
        );
        res.json(teams);
      })
      .catch(next);
  });

AllRouter // get the SETS for 10 public teams, default upon loading?
  .route('/sets')
  .get((req, res, next) => {
    const page = Number(req.query.page);
    AllService.getSetsOfTenTeamsDefault(req.app.get('db'), page)
      .then(sets => {
        if (!sets) {
          logger.error('Failed get teams!');
          return res.status(404).json({
            error: { message: 'There Are No Teams' }
          });
        }
        logger.info(
          'Successful get 10 teams!'
        );
        res.json(sets);
      })
      .catch(next);
  });

AllRouter // get the likes for an individual team;  will need to be used in conjunction or seperately.
  .route('/:team_id/likes')
  .get((req, res, next) => {
    const {team_id} = req.params;
    AllService.getLikesforATeam(req.app.get('db'), team_id)
      .then(likes => {
        if (!likes) {
          logger.error('Failed get likes for teams!');
          return res.status(404).json({
            error: { message: 'There are no teams to like' }
          });
        }
        logger.info(
          'Successful get likes for 10 teams!'
        );
        res.json(likes);
      })
      .catch(next);
  });

AllRouter // get 10 teams with a search
  .route('/search')
  .get((req, res, next) => {
    const page = Number(req.query.page);
    const sort = req.query.sort;
    const species = req.query.species;
    AllService.getTenTeamsWithSearch(req.app.get('db'), page, sort, species)
      .then(teams => {
        if (!teams) {
          logger.error('Failed get teams!');
          return res.status(404).json({
            error: { message: 'There Are No Teams' }
          });
        }
        logger.info(
          'Successful get 10 teams!'
        );
        res.json(teams);
      })
      .catch(next);
  });
  

AllRouter
  .route('/:team_id')
  .get((req, res, next) => {
    const {team_id} = req.params;
    AllService.getTeamById(req.app.get('db'), team_id)
      .then(team => {
        if (!team) {
          logger.error(`Failed get team with id: ${team_id}`);
          return res.status(404).json({
            error: { message: 'Team doesn\'t exist' }
          });
        }
        logger.info(
          `Successful get : team ${team.team_name} was retrieved with id: ${team.id}`
        );
        res.json(team);
      })
      .catch(next);
  });

AllRouter
  .route('/:team_id/:set_id')
  .get((req, res, next) => {
    const {set_id} = req.params;
    const {team_id} = req.params;
    AllService.getSetById(req.app.get('db'), set_id, team_id)
      .then(set => {
        if (!set) {
          logger.error(`Failed get set with id: ${set_id}`);
          return res.status(404).json({
            error: { message: 'Set doesn\'t exist' }
          });
        }
        logger.info(
          `Successful get : team ${set.species} was retrieved with id: ${set.id}`
        );
        res.json(set);
      })
      .catch(next);
  });

module.exports = AllRouter;