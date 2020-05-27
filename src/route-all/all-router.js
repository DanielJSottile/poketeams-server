const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const AllRouter = express.Router();
const AllService = require('./all-service');

// Sanitization

const sanitizeTeam = team => ({
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

const sanitizeSet = set => ({
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
  team_id: set.team_id
});

// Teams


AllRouter // Get 10 teams with a search
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
        res.json(teams.map(team => sanitizeTeam(team)));
      })
      .catch(next);
  });
  

AllRouter
  .route('/:team_id') // Get a team by it's ID
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
          `Successful get : team ${team[0].team_name} was retrieved with id: ${team[0].id}`
        );
        res.json(sanitizeTeam(team[0]));
      })
      .catch(next);
  });


// Sets

AllRouter // Gets the Sets for 10 Public Teams, default upon loading (also no longer being used)
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
        res.json(sets.map(set => sanitizeSet(set)));
      })
      .catch(next);
  });

AllRouter // Gets the Sets for an individual Team, used for the public view.
  .route('/:team_id/sets')
  .get((req, res, next) => {
    const {team_id} = req.params;
    AllService.getSetsForIndividualTeam(req.app.get('db'), team_id)
      .then(sets => {
        if (!sets) {
          logger.error('Failed get sets for teams!');
          return res.status(404).json({
            error: { message: 'There probably isnt this team' }
          });
        }
        logger.info(
          'Successful get sets for individual team!'
        );
        res.json(sets.map(set => sanitizeSet(set)));
      })
      .catch(next);
  });


// Don't mess with the position of this thing.  Screws everything up.  IS THIS EVEN BEING USED?
AllRouter 
  .route('/:team_id/:set_id') // Gets a Set from a specific team by its ID.
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
        res.json(sanitizeSet(set));
      })
      .catch(next);
  });

// FUTURE

// AllRouter // get the likes for an individual team;  will need to be used in conjunction or seperately.
//   .route('/:team_id/likes')
//   .get((req, res, next) => {
//     const {team_id} = req.params;
//     AllService.getLikesforATeam(req.app.get('db'), team_id)
//       .then(likes => {
//         if (!likes) {
//           logger.error('Failed get likes for teams!');
//           return res.status(404).json({
//             error: { message: 'There are no teams to like' }
//           });
//         }
//         logger.info(
//           'Successful get likes for 10 teams!'
//         );
//         res.json(likes);
//       })
//       .catch(next);
//   });


module.exports = AllRouter;