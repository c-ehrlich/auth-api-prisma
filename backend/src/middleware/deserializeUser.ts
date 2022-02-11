// 1. get access token from auth header
// 2. decode/verify it
// 3. attach user to res.locals

import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // our Authorization header contains a bearer token, in which is the accessToken variable
  // Format: `Authorization: "Bearer abc123"`
  const accessToken = (req.headers.authorization || '').replace(/Bearer\s/, ''); // there may not be a header

  if (!accessToken) {
    // No logged in user, move on
    return next();
  }

  const decoded = verifyJwt(accessToken, 'accessTokenPublicKey');

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
};

export default deserializeUser;
