const AuthService = require('../auth/auth-service');

function requireAuth(req: any, res: any, next: any) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);

    AuthService.getUserWithUserName(req.app.get('db'), payload.sub)
      .then((user: any) => {
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' });
        req.user = user;
        next();
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.error(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
}

module.exports = {
  requireAuth,
};
