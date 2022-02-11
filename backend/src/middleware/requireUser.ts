import { Request, Response, NextFunction } from 'express';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  // because we have deserializeUser as global middleware, we know that the
  // user object will always be on res.locals
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireUser;
