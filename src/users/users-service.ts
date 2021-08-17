import bcrypt from 'bcryptjs';
import xss from 'xss';
import CryptoJS from 'crypto-js';
import config from '../config';
import { UserType, NewUserType } from '../@types';

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.!@$%^&(){}[\]:;<>,.?~_+-=|])[\S]+/;
const { ENCRYPTION_KEY } = config;

const UsersService = {
  hasUserWithUserName(db: any, user_name: string) {
    return db('users')
      .where({ user_name })
      .first()
      .then((user: UserType) => !!user);
  },
  insertUser(db: any, newUser: NewUserType) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]: [UserType]) => user);
  },
  validatePassword(password: string) {
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
  hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  },
  encrypt(text: string) {
    // returns an encrypted string, for later
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  },

  decrypt(encrypted: string) {
    // returns the decrypted text, for later
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
  serializeUser(user: UserType) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    };
  },
};

export default UsersService;
