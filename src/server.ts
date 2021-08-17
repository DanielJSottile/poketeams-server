/* eslint-disable no-console */

import app from './app';
import knex from 'knex';
import config from './config';
const { PORT, DATABASE_URL } = config;

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
