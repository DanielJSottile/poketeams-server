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

AllRouter
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
    AllService.getSetById(req.app.get('db'), set_id)
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