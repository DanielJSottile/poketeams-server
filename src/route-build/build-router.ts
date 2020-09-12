export {};
const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const BuildRouter = express.Router();
const dataParser = express.json();
const BuildService = require('./build-service');
const AllService = require('../route-all/all-service');
const { requireAuth } = require('../middleware/jwt-auth');

// Interfaces

export interface Folder {
  id: number;
  folder_name: string;
  user_id: number;
  date_created: Date;
  date_modified: Date | null;
}

export interface Team {
  id: number;
  team_name: string;
  description: string;
  date_created: Date;
  date_modified: Date | null;
  user_id: number;
  user_name: string;
  folder_id: number;
  folder_name: string;
}

export interface Set {
  id: number;
  team_name: string;
  description: string;
  date_created: Date;
  date_modified: Date | null;
  user_id: number;
  user_name: string;
  folder_id: number;
  folder_name: string;
  nickname: string;
  species: string;
  gender: string;
  item: string;
  ability: string;
  level: number;
  shiny: boolean;
  happiness: number;
  nature: string;
  hp_ev: number;
  atk_ev: number;
  def_ev: number;
  spa_ev: number;
  spd_ev: number;
  spe_ev: number;
  hp_iv: number;
  atk_iv: number;
  def_iv: number;
  spa_iv: number;
  spd_iv: number;
  spe_iv: number;
  move_one: string;
  move_two: string;
  move_three: string;
  move_four: string;
  team_id: number;
}

// Sanitization

const sanitizeFolder = (folder: Folder) => ({
  id: folder.id,
  folder_name: xss(folder.folder_name),
  user_id: folder.user_id,
  date_created: xss(folder.date_created),
  date_modified: xss(folder.date_modified),
});

const sanitizeTeam = (team: Team) => ({
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

const sanitizeSet = (set: Set) => ({
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

// Build Route

// Folders

BuildRouter.route('/folder/:folder_id') // Get a single Folder by ID
  .all(requireAuth)
  .get((req: any, res: any, next: any) => {
    const { folder_id } = req.params;
    BuildService.getSingleUserFolderById(req.app.get('db'), folder_id)
      .then((folder: any) => {
        if (!folder) {
          logger.error(`Failed get folder with id: ${folder_id}`);
          return res.status(404).json({
            error: { message: "folder doesn't exist" },
          });
        }
        logger.info(
          `Successful get : folder ${folder.folder_name} was retrieved with id: ${folder.id}`
        );
        res.json(sanitizeFolder(folder));
      })
      .catch(next);
  })
  .delete((req: any, res: any, next: any) => {
    const { folder_id } = req.params;
    BuildService.getSingleUserFolderById(req.app.get('db'), folder_id).then(
      (folder: any) => {
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
  .get((req: any, res: any, next: any) => {
    const { user_id } = req.params;
    BuildService.getUserFolders(req.app.get('db'), user_id)
      .then((folders: any) => {
        if (!folders) {
          logger.error(`Failed get folders with id: ${user_id}`);
          return res.status(404).json({
            error: { message: 'folders do not exist' },
          });
        }
        logger.info(
          `Successful get : folders were retrieved with id: ${user_id}`
        );
        res.json(folders.map((folder: Folder) => sanitizeFolder(folder)));
      })
      .catch(next);
  })
  .post(dataParser, (req: any, res: any, next: any) => {
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
      .then((folder: any) => {
        res.status(201).json(sanitizeFolder(folder));
      })
      .catch(next);
  })
  .patch(dataParser, (req: any, res: any, next: any) => {
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
  .get((req: any, res: any, next: any) => {
    const { user_id } = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserFoldersFilter(req.app.get('db'), user_id, sort, species)
      .then((folders: any) => {
        if (!folders) {
          logger.error('Failed get folders!');
          return res.status(404).json({
            error: { message: 'There Are No Folders' },
          });
        }
        logger.info('Successful get the folders!');
        res.json(folders.map((folder: Folder) => sanitizeFolder(folder)));
      })
      .catch(next);
  });

// Teams

BuildRouter.route('/teams/:user_id') // get user teams, post/patch new team
  .all(requireAuth)
  .get((req: any, res: any, next: any) => {
    const { user_id } = req.params;
    BuildService.getUserTeams(req.app.get('db'), user_id)
      .then((teams: any) =>
        res.json(teams.map((team: Team) => sanitizeTeam(team)))
      )
      .catch(next);
  })
  .post(dataParser, (req: any, res: any, next: any) => {
    const newTeam = req.body;
    // eslint-disable-next-line eqeqeq
    for (const [key, value] of Object.entries(newTeam))
      if (value == null) {
        return res
          .status(400)
          .json({ error: `Missing '${key}' in request body` });
      }

    BuildService.postUserTeam(req.app.get('db'), newTeam)
      .then((team: any) => {
        res.status(201).json(sanitizeTeam(team));
      })
      .catch(next);
  })
  .patch(dataParser, (req: any, res: any, next: any) => {
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
  .delete((req: any, res: any, next: any) => {
    const { team_id } = req.params;
    AllService.getTeamById(req.app.get('db'), Number(team_id))
      .then((team: any) => {
        if (!team) {
          logger.error(`Failed get delete with id: ${team_id}`);
          return res.status(404).json({
            error: { message: "Team doesn't exist" },
          });
        }
        BuildService.deleteUserTeam(req.app.get('db'), Number(team_id)).then(
          () => {
            logger.info('Successful delete : Team was deleted');
            res.status(204).end();
          }
        );
      })
      .catch(next);
  });

BuildRouter.route('/teams/:user_id/filter/') // get the user teams when filtered
  .all(requireAuth)
  .get((req: any, res: any, next: any) => {
    const { user_id } = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserTeamsFilter(req.app.get('db'), user_id, sort, species)
      .then((teams: any) => {
        if (!teams) {
          logger.error('Failed get teams!');
          return res.status(404).json({
            error: { message: 'There Are No Teams' },
          });
        }
        logger.info('Successful get the folders!');
        res.json(teams.map((team: Team) => sanitizeTeam(team)));
      })
      .catch(next);
  });

// Sets

BuildRouter.route('/sets/:user_id') // get the user sets, post/patch a set
  .all(requireAuth)
  .get((req: any, res: any, next: any) => {
    const { user_id } = req.params;
    BuildService.getUserSets(req.app.get('db'), user_id)
      .then((sets: any) => res.json(sets.map((set: Set) => sanitizeSet(set))))
      .catch(next);
  })
  .post(dataParser, (req: any, res: any, next: any) => {
    const newSet = req.body;
    // eliminate the check on values because we can have false and null values!

    BuildService.postUserSet(req.app.get('db'), newSet)
      .then((set: any) => {
        res.status(201).json(sanitizeSet(set));
      })
      .catch(next);
  })
  .patch(dataParser, (req: any, res: any, next: any) => {
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
        res.status(204).send();
      })
      .catch(next);
  });

BuildRouter.route('/set/:team_id/:set_id') // delete a set by id
  .all(requireAuth)
  .delete((req: any, res: any, next: any) => {
    const { set_id } = req.params;
    const { team_id } = req.params;
    AllService.getSetById(req.app.get('db'), Number(set_id), Number(team_id))
      .then((set: any) => {
        if (!set) {
          logger.error(`Failed get delete with id: ${set_id}`);
          return res.status(404).json({
            error: { message: "Set doesn't exist" },
          });
        }
        BuildService.deleteUserSet(req.app.get('db'), Number(set_id)).then(
          () => {
            logger.info('Successful delete : Set was deleted');
            res.status(204).end();
          }
        );
      })
      .catch(next);
  });

BuildRouter.route('/sets/:user_id/filter/') // gets the user sets when filtered
  .all(requireAuth)
  .get((req: any, res: any, next: any) => {
    const { user_id } = req.params;
    const sort = req.query.sort;
    const species = req.query.species;
    BuildService.getUserSetsFilter(req.app.get('db'), user_id, sort, species)
      .then((sets: any) => {
        if (!sets) {
          logger.error('Failed get sets!');
          return res.status(404).json({
            error: { message: 'There Are No sets' },
          });
        }
        logger.info('Successful get the folders!');
        res.json(sets.map((set: Set) => sanitizeSet(set)));
      })
      .catch(next);
  });

module.exports = BuildRouter;
