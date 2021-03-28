require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString:
        process.env.NODE_ENV === 'test'
          ? process.env.DB_TEST_URL
          : process.env.DATABASE_URL,
      ssl: !!process.env.SSL,
    },
    production: {
      client: 'postgresql',
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      },
    },
  },
};
