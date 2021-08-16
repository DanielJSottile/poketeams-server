process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRY = '3m';

import knex from 'knex';
import dotenv from 'dotenv';
import app from '../src/app';
import helpers from './test-helpers';
import { expect } from 'chai';
import supertest from 'supertest';

dotenv.config();

describe.only('Everything', () => {
  let testDB: knex<any, unknown[]>;

  const {
    testFolders,
    testTeams,
    testSets,
    testUsers,
  } = helpers.makeFixtures();

  before(() => {
    testDB = knex({
      client: 'pg',
      connection: process.env.DB_TEST_URL,
    });
  });
  before(() => app.set('db', testDB));
  before(() => testDB('sets').del());
  before(() => testDB('users').del());
  before(() => testDB('teams').del());
  before(() => testDB('folders').del());
  after(() => testDB('sets').del());
  after(() => testDB('users').del());
  after(() => testDB('teams').del());
  after(() => testDB('folders').del());

  after(() => testDB.destroy());

  context('Database has data', () => {
    beforeEach(() =>
      helpers.seedOtherTables(
        testDB,
        testUsers,
        testFolders,
        testTeams,
        testSets
      )
    );
    afterEach(() => testDB('sets').del());
    afterEach(() => testDB('users').del());
    afterEach(() => testDB('teams').del());
    afterEach(() => testDB('folders').del());

    describe('GET ALL endpoints', () => {
      it('Gets 10 Teams With Some Valid Search Parameters', () => {
        return supertest(app)
          .get('/api/all/search?page=1&sort=newest&species=all')
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('Gets a team by its id', () => {
        return supertest(app)
          .get('/api/all/1')
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('object');
          });
      });
      it('Gets a set by its id', () => {
        return supertest(app)
          .get('/api/all/set/1')
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('object');
          });
      });
      it('Gets the sets for a specific team by id', () => {
        return supertest(app)
          .get('/api/all/1/sets')
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
    });

    describe('GET BUILD endpoints', () => {
      it('Gets a single folder by id', () => {
        return supertest(app)
          .get('/api/build/folder/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('object');
          });
      });
      it('Gets the folders for a user id', () => {
        return supertest(app)
          .get('/api/build/folders/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('Gets the folders for a user id when filtered by basic filter', () => {
        return supertest(app)
          .get('/api/build/folders/1/filter?page=1&sort=newest&species=all')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('Gets the teams for a user id', () => {
        return supertest(app)
          .get('/api/build/teams/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('Gets the teams for a user id when filtered by basic filter', () => {
        return supertest(app)
          .get('/api/build/teams/1/filter?page=1&sort=newest&species=all')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('Gets the sets for a user id', () => {
        return supertest(app)
          .get('/api/build/sets/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('Gets the sets for a user id when filtered by basic filter', () => {
        return supertest(app)
          .get('/api/build/sets/1/filter?page=1&sort=newest&species=all')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
    });

    describe('POST BUILD Endpoints', () => {
      it('Posts a new folder by user id', () => {
        const newfolder = { folder_name: 'New Test', user_id: 1 };
        return supertest(app)
          .post('/api/build/folders/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newfolder)
          .expect(201)
          .then((res) => {
            expect(res.body).to.be.an('object');
          });
      });
      it('Posts a new team by user id', () => {
        const newTeam = {
          team_name: 'team',
          description: 'desc',
          folder_id: 1,
        };
        return supertest(app)
          .post('/api/build/teams/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newTeam)
          .expect(201)
          .then((res) => {
            expect(res.body).to.be.an('object');
          });
      });
      it('Posts a new set by user id', () => {
        const newSet = {
          team_id: 1,
          nickname: 'test',
          species: 'Pikachu',
          gender: 'F',
          item: 'Leftovers',
          ability: 'Static',
          level: 100,
          shiny: false,
          happiness: 255,
          nature: 'Adamant',
          hp_ev: 0,
          atk_ev: 0,
          def_ev: 0,
          spa_ev: 0,
          spd_ev: 0,
          spe_ev: 0,
          hp_iv: 31,
          atk_iv: 31,
          def_iv: 31,
          spa_iv: 31,
          spd_iv: 31,
          spe_iv: 31,
          move_one: 'Tackle',
          move_two: 'Zippy Zap',
          move_three: 'Thunderbolt',
          move_four: 'Thunder',
        };
        return supertest(app)
          .post('/api/build/sets/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newSet)
          .expect(201)
          .then((res) => {
            expect(res.body).to.be.an('object');
          });
      });
    });

    describe('PATCH BUILD Endpoints', () => {
      it('Patches a folder by user id and body', () => {
        const newfolder = { folder_name: 'New Test', id: 1 };
        return supertest(app)
          .patch('/api/build/folders/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newfolder)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get('/api/build/folder/1')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200)
          );
      });
      it('Patches a team by user id and body', () => {
        const newTeam = {
          team_name: 'New team',
          description: 'New desc',
          id: 1,
        };
        return supertest(app)
          .patch('/api/build/teams/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newTeam)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get('/api/all/1')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200)
          );
      });
      it('Patches a set by user id and body', () => {
        const newSet = {
          id: 1,
          team_id: 1,
          nickname: 'New test',
          species: 'Pikachu',
          gender: 'F',
          item: 'Leftovers',
          ability: 'Static',
          level: 100,
          shiny: false,
          happiness: 255,
          nature: 'Timid',
          hp_ev: 0,
          atk_ev: 0,
          def_ev: 0,
          spa_ev: 0,
          spd_ev: 0,
          spe_ev: 0,
          hp_iv: 31,
          atk_iv: 31,
          def_iv: 31,
          spa_iv: 31,
          spd_iv: 31,
          spe_iv: 31,
          move_one: 'Tackle',
          move_two: 'Zippy Zap',
          move_three: 'Thunderbolt',
          move_four: 'Thundershock',
        };
        return supertest(app)
          .patch('/api/build/sets/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newSet)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get('/api/all/set/1')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200)
          );
      });
    });

    describe('DELETE BUILD Endpoints', () => {
      it('Delete a folder by its id', () => {
        return supertest(app)
          .delete('/api/build/folder/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
      it('Delete a team by its id', () => {
        return supertest(app)
          .delete('/api/build/team/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
      it('Delete a set by its id', () => {
        return supertest(app)
          .delete('/api/build/set/1/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
    });
  });

  context('Database is empty', () => {
    beforeEach(() => helpers.seedUsers(testDB, testUsers));
    beforeEach(() => testDB('folders').del());
    beforeEach(() => testDB('teams').del());
    beforeEach(() => testDB('sets').del());
    afterEach(() => testDB('users').del());

    describe('GET ALL Endpoints when Empty', () => {
      it('Gets An Empty Array when looking for 10 teams with Valid default Search Params', () => {
        return supertest(app)
          .get('/api/all/search?page=1&sort=newest&species=all')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.eql([]); // needs some fixing I think
          });
      });
      it('When Empty Gets a team by its id', () => {
        return supertest(app).get('/api/all/1').expect(404);
      });
      it('When Empty Gets the sets for a specific team by id', () => {
        return supertest(app)
          .get('/api/all/1/sets')
          .expect(200)
          .then((res) => {
            expect(res.body).to.eql([]);
          });
      });
    });

    describe('GET BUILD Endpoints when Empty', () => {
      it('When Empty Gets a single folder by id', () => {
        return supertest(app)
          .get('/api/build/folder/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('object');
          });
      });
      it('When Empty Gets the folders for a user id', () => {
        return supertest(app)
          .get('/api/build/folders/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('When Empty Gets the folders for a user id when filtered by basic filter', () => {
        return supertest(app)
          .get('/api/build/folders/1/filter?page=1&sort=newest&species=all')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('When Empty Gets the teams for a user id', () => {
        return supertest(app)
          .get('/api/build/teams/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('When Empty Gets the teams for a user id when filtered by basic filter', () => {
        return supertest(app)
          .get('/api/build/teams/1/filter?page=1&sort=newest&species=all')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('When Empty Gets the sets for a user id', () => {
        return supertest(app)
          .get('/api/build/sets/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
      it('When Empty Gets the sets for a user id when filtered by basic filter', () => {
        return supertest(app)
          .get('/api/build/sets/1/filter?page=1&sort=newest&species=all')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array');
          });
      });
    });
  });
});
