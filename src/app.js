/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const AllRouter = require('./route-all/all-router');
const UserRouter = require('./route-build/build-router');
const AuthRouter = require('./auth/auth-router');
const { NODE_ENV} = require('./config');


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// middleware

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// server requests

app.use('/api/all', AllRouter);
app.use('/api/build', UserRouter);
app.use('/api/auth', AuthRouter);

// errorHandler middleware

app.use(function errorHandler(error, req, res, next){
  let response;
  if (NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  } else {
    console.error(error);
    response = {message: error.message, error};
  }
  res.status(500).json(response);
});

// exports

module.exports = app;