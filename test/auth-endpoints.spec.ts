import knex from 'knex';
import dotenv from 'dotenv';
import { sign, Secret } from 'jsonwebtoken';
import app from '../src/app';
import helpers from './test-helpers';
import supertest from 'supertest';
dotenv.config();

describe('Auth Endpoints', () => {
  let db: knex<any, unknown[]>;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DB_TEST_URL,
    });
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach(() => helpers.cleanTables(db));

  describe('POST /api/auth/login', () => {
    beforeEach(() => helpers.seedUsers(db, testUsers));

    const requiredFields = ['user_name', 'password'];

    requiredFields.forEach((field: string) => {
      const loginAttemptBody: { [key: string]: string } = {
        user_name: testUser.user_name,
        password: testUser.password,
      };

      it('responds with 400 required error when field is missing', () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing '${field}' in request body` });
      });
    });
    it('responds 400 invalid user_name or password when invalid username', () => {
      const userInvalidUser = { user_name: 'invalid', password: 'exists' };

      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: 'Incorrect user_name or password' });
    });
    it('responds 400 invalid username or password when invalid password', () => {
      const userInvalidPassword = {
        user_name: testUser.user_name,
        password: 'invalid',
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPassword)
        .expect(400, { error: 'Incorrect user_name or password' });
    });
    it('responds 200 and JWT auth when valid credentials', () => {
      const validCreds = {
        user_name: testUser.user_name,
        password: testUser.password,
      };
      const expectedToken = sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET as Secret,
        {
          subject: testUser.user_name,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      );

      return supertest(app)
        .post('/api/auth/login')
        .send(validCreds)
        .expect(200, { authToken: expectedToken });
    });
  });
});
