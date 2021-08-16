import express from 'express';
import path from 'path';
import UsersService from './users-service';
import { UserType } from '../@types';

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { password, user_name } = req.body; // we will add to this in the future?

  for (const field of ['user_name', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });

  // TODO: check user_name doesn't start with spaces

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get('db'), user_name)
    .then((hasUserWithUserName: boolean) => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: 'Username already taken' });

      return UsersService.hashPassword(password).then(
        (hashedPassword: string) => {
          const newUser = {
            user_name,
            password: hashedPassword,
            date_created: 'now()',
          };

          return UsersService.insertUser(req.app.get('db'), newUser).then(
            (user: UserType) => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user));
            }
          );
        }
      );
    })
    .catch(next);
});

export default usersRouter;
