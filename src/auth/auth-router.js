const express = require('express');
const jsonBodyParser = express.json();
const AuthService = require('./auth-service');
const { requireAuth } = require('../middleware/jwt-auth');
const authRouter = express.Router();

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  // eslint-disable-next-line eqeqeq
  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Incorrect user_name or password' });
      }
      return AuthService.comparePasswords(
        loginUser.password,
        user.password
      ).then((isMatch) => {
        if (!isMatch) {
          return res
            .status(400)
            .json({ error: 'Incorrect user_name or password' });
        }
        const sub = user.user_name;
        const payload = { user_id: user.id };
        res.send({ authToken: AuthService.createJwt(sub, payload) });
      });
    })
    .catch(next);
});

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name;
  const payload = { user_id: req.user.id };
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  });
});

module.exports = authRouter;
