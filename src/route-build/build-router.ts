import { Router, json } from 'express';
import logger from '../logger';
import requireAuth from '../middleware/jwt-auth';
import BuildService from './build-service';
import AllService from '../route-all/all-service';
import {
  sanitizeFolder,
  sanitizeTeam,
  sanitizeSet,
} from '../utils/sanitization';
import { PokemonFolder } from '../@types';

const BuildRouter = Router();
const dataParser = json();

// Build Route

// Folders

BuildRouter.route('/folder/:folder_id') // Get a single Folder by ID
  .all(requireAuth)
  .get((req, res, next) => {
    const { folder_id } = req.params;
    BuildService.getSingleUserFolderById(req.app.get('db'), folder_id)
      .then((folders: PokemonFolder[]) => {
        if (!folders) {
          logger.error(`Failed get folder with id: ${folder_id}`);
          return res.status(404).json({
            error: { message: "folder doesn't exist" },
          });
        }
        logger.info(`Successful get : folder`);
        res.json(folders.map((folder) => sanitizeFolder(folder)));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { folder_id } = req.params;
    BuildService.getSingleUserFolderById(req.app.get('db'), folder_id).then(
      (folder: PokemonFolder[]) => {
        if (!folder) {
          logger.error(`Failed get delete with id: ${folder_id}`);
          return res.status(404).json({
            error: { message: "Folder doesn't exist" },
          });
        }
        BuildService.deleteUserFolder(req.app.get('db'), folder_id)
          .then(() => {
            logger.info('Successful delete : Folder was deleted');
            res.status(204).end();
          })
          .catch(next);
      }
    );
  });

BuildRouter.route('/folders/:user_id') // Get the users folders, or post/patch a folder to here.
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id } = req.params;
    BuildService.getUserFolders(req.app.get('db'), user_id)
      .then((folders: PokemonFolder[]) => {
        if (!folders) {
          logger.error(`Failed get folders with id: ${user_id}`);
          return res.status(404).json({
            error: { message: 'folders do not exist' },
          });
        }
        logger.info(
          `Successful get : folders were retrieved with id: ${user_id}`
        );
        res.json(folders.map((folder) => sanitizeFolder(folder)));
      })
      .catch(next);
  })
  .post(dataParser, (req, res, next) => {
    const { user_id } = req.body;
    const { folder_name } = req.body;
    const newFolder = { folder_name, user_id };

    // eslint-disable-next-line eqeqeq
    for (const [key, value] of Object.entries(newFolder))
      if (value == null) {
        return res
          .status(400)
          .json({ error: `Missing '${key}' in request body` });
      }
    newFolder.user_id = user_id;

    BuildService.postUserFolder(req.app.get('db'), newFolder)
      .then((folder: PokemonFolder) => {
        res.status(201).json(sanitizeFolder(folder));
      })
      .catch(next);
  })
  .patch(dataParser, (req, res, next) => {
    const { id } = req.body;
    const { folder_name } = req.body;
    const folderUpdate = { folder_name: folder_name };

    for (const [key, value] of Object.entries(folderUpdate)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res
          .status(400)
          .json({ error: `Missing '${key}' in request body` });
      }
    }

    BuildService.patchUserFolder(req.app.get('db'), id, folderUpdate)
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  });

BuildRouter.route('/folders/:user_id/filter/') // get user folders when filtered
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id } = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserFoldersFilter(req.app.get('db'), user_id, sort, species)
      .then((folders) => {
        if (!folders) {
          logger.error('Failed get folders!');
          return res.status(404).json({
            error: { message: 'There Are No Folders' },
          });
        }
        logger.info('Successful get the folders!');
        res.json(folders.map((folder) => sanitizeFolder(folder)));
      })
      .catch(next);
  });

// Teams

BuildRouter.route('/teams/:user_id') // get user teams, post/patch new team
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id } = req.params;
    BuildService.getUserTeams(req.app.get('db'), user_id)
      .then((teams) => res.json(teams.map((team) => sanitizeTeam(team))))
      .catch(next);
  })
  .post(dataParser, (req, res, next) => {
    const newTeam = req.body;
    // eslint-disable-next-line eqeqeq
    for (const [key, value] of Object.entries(newTeam))
      if (value == null) {
        return res
          .status(400)
          .json({ error: `Missing '${key}' in request body` });
      }

    BuildService.postUserTeam(req.app.get('db'), newTeam)
      .then((team) => {
        res.status(201).json(sanitizeTeam(team));
      })
      .catch(next);
  })
  .patch(dataParser, (req, res, next) => {
    const body = req.body;
    const id = body.id;
    const teamUpdate = {
      team_name: body.team_name,
      description: body.description,
    };

    BuildService.patchUserTeam(req.app.get('db'), id, teamUpdate)
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  });

BuildRouter.route('/team/:team_id') // delete a single team
  .all(requireAuth)
  .delete((req, res, next) => {
    const { team_id } = req.params;
    AllService.getTeamById(req.app.get('db'), team_id)
      .then((team) => {
        if (!team) {
          logger.error(`Failed get delete with id: ${team_id}`);
          return res.status(404).json({
            error: { message: "Team doesn't exist" },
          });
        }
        BuildService.deleteUserTeam(req.app.get('db'), team_id).then(() => {
          logger.info('Successful delete : Team was deleted');
          res.status(204).end();
        });
      })
      .catch(next);
  });

BuildRouter.route('/teams/:user_id/filter/') // get the user teams when filtered
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id } = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserTeamsFilter(req.app.get('db'), user_id, sort, species)
      .then((teams) => {
        if (!teams) {
          logger.error('Failed get teams!');
          return res.status(404).json({
            error: { message: 'There Are No Teams' },
          });
        }
        logger.info('Successful get the folders!');
        res.json(teams.map((team) => sanitizeTeam(team)));
      })
      .catch(next);
  });

// Sets

BuildRouter.route('/sets/:user_id') // get the user sets, post/patch a set
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id } = req.params;
    BuildService.getUserSets(req.app.get('db'), user_id)
      .then((sets) => res.json(sets.map((set) => sanitizeSet(set))))
      .catch(next);
  })
  .post(dataParser, (req, res, next) => {
    const newSet = req.body;
    // eliminate the check on values because we can have false and null values!

    BuildService.postUserSet(req.app.get('db'), newSet)
      .then((set) => {
        res.status(201).json(sanitizeSet(set));
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
      gigantamax: body.gigantamax,
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
        res.status(204).send();
      })
      .catch(next);
  });

BuildRouter.route('/set/:team_id/:set_id') // delete a set by id
  .all(requireAuth)
  .delete((req, res, next) => {
    const { set_id } = req.params;
    const { team_id } = req.params;
    AllService.getSetById(req.app.get('db'), set_id)
      .then((set) => {
        if (!set) {
          logger.error(`Failed get delete with id: ${set_id}`);
          return res.status(404).json({
            error: { message: "Set doesn't exist" },
          });
        }
        BuildService.deleteUserSet(req.app.get('db'), set_id).then(() => {
          logger.info('Successful delete : Set was deleted');
          res.status(204).end();
        });
      })
      .catch(next);
  });

BuildRouter.route('/sets/:user_id/filter/') // gets the user sets when filtered
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id } = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserSetsFilter(req.app.get('db'), user_id, sort, species)
      .then((sets) => {
        if (!sets) {
          logger.error('Failed get sets!');
          return res.status(404).json({
            error: { message: 'There Are No sets' },
          });
        }
        logger.info('Successful get the folders!');
        res.json(sets.map((set) => sanitizeSet(set)));
      })
      .catch(next);
  });

export default BuildRouter;
