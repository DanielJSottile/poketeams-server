/* eslint-disable no-console */
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import AllRouter from './route-all/all-router';
import BuildRouter from './route-build/build-router';
import UserRouter from './users/users-router';
import AuthRouter from './auth/auth-router';
import config from './config';

dotenv.config();

const { NODE_ENV, CLIENT_ORIGIN } = config;

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// middleware

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors(CLIENT_ORIGIN as CorsOptions));

// server requests

app.use('/api/all', AllRouter);
app.use('/api/build', BuildRouter);
app.use('/api/users', UserRouter), app.use('/api/auth', AuthRouter);

// errorHandler middleware

app.use(function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

// exports

export default app;
