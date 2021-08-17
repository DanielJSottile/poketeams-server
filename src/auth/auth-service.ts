import bcrypt from 'bcryptjs';
import knex from 'knex';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
const { JWT_SECRET, JWT_EXPIRY } = config;

const AuthService = {
  getUserWithUserName(
    db: knex<any, unknown[]>,
    user_name: string | JwtPayload | (() => string) | undefined
  ) {
    return db('users').where({ user_name }).first();
  },

  comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },

  createJwt(subject: string, payload: string | object | Buffer) {
    return jwt.sign(payload, JWT_SECRET, {
      subject,
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256',
    });
  },

  verifyJwt(token: string) {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },

  parseBasicToken(token: string) {
    return Buffer.from(token, 'base64').toString().split(':');
  },
};

export default AuthService;
