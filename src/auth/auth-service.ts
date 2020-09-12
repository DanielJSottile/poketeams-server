export {};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUserWithUserName(db: any, user_name: any) {
    return db('users').where({ user_name }).first();
  },

  comparePasswords(password: string, hash: any) {
    return bcrypt.compare(password, hash);
  },

  createJwt(subject: any, payload: any) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    });
  },

  verifyJwt(token: any) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },

  parseBasicToken(token: any) {
    return Buffer.from(token, 'base64').toString().split(':');
  },
};

module.exports = AuthService;
