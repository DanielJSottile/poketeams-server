const bcrypt = require('bcryptjs');
const xss = require('xss');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.!@$%^&(){}[\]:;<>,\.\?\~_+-=|])[\S]+/;
const config = require('../config');
// Nodejs encryption with CTR
const CryptoJS = require('crypto-js');
const AES = require('crypto-js/aes');

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return `Password is too short.  Must be longer than 8 characters.
      Password cannot start or end with empty spaces.
      Password must contain an uppercase, lowercase, number and a special char.`;
    }
    if (password.length > 72) {
      return `Password is too long.  Password must be less than 72 characters.
      Password cannot start or end with empty spaces.
      Password must contain an uppercase, lowercase, number and a special char.`;
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return `Password cannot start or end with empty spaces.
      Password must contain an uppercase, lowercase, number and a special char`;
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  encrypt(text) { // returns an encrypted string, for later
    return CryptoJS.AES.encrypt(text, config.ENCRYPTION_KEY).toString();
  },

  decrypt(encrypted) { // returns the decrypted text, for later
    const bytes = CryptoJS.AES.decrypt(encrypted, config.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UsersService;