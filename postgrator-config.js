require('dotenv').config();

module.exports = {
  driver: 'pg',
  connection: {
    connectionString:
      process.env.NODE_ENV === 'test'
        ? process.env.DB_TEST_URL
        : process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
