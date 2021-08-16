import express from 'express';
import logger from '../logger';
import AllService from './all-service';
import BuildService from '../route-build/build-service';
import { PokemonSet, PokemonTeam, PokemonFolder } from '../@types';
import {
  sanitizeFolder,
  sanitizeTeam,
  sanitizeSet,
} from '../utils/sanitization';
const AllRouter = express.Router();

// Folder

AllRouter.route('/folderpublic/:folder_id') // Get a single Folder by ID
  .get((req, res, next) => {
    const { folder_id } = req.params;
    BuildService.getSingleUserFolderById(req.app.get('db'), folder_id)
      .then((folder: PokemonFolder[]) => {
        if (!folder) {
          logger.error(`Failed get folder with id: ${folder_id}`);
          return res.status(404).json({
            error: { message: "folder doesn't exist" },
          });
        }
        logger.info(
          `Successful get : folder ${folder[0].folder_name} was retrieved with id: ${folder[0].id}`
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
      .then((teams: PokemonTeam[]) => {
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
      .then((teams: PokemonTeam[]) => {
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
      .then((team: PokemonTeam[]) => {
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
      .then((sets: PokemonSet[]) => {
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
      .then((set: PokemonSet[]) => {
        if (!set[0]) {
          logger.error(`Failed get set with id: ${set_id}`);
          return res.status(404).json({
            error: { message: "Set doesn't exist" },
          });
        }
        logger.info(
          `Successful get : set ${set[0].species} was retrieved with id: ${set[0].id}`
        );
        res.json(sanitizeSet(set[0]));
      })
      .catch(next);
  });

export default AllRouter;
