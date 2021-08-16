import AuthService from '../auth/auth-service';
import { Request, Response, NextFunction } from 'express';
import { UserType } from '../@types';

interface AuthRequest extends Request {
  user?: UserType;
}

export default function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
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
      .then((user: UserType) => {
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' });
        req.user = user;
        next();
      })
      .catch((err: string) => {
        // eslint-disable-next-line no-console
        console.error(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
}
