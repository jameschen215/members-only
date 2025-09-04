import { RequestHandler } from 'express';
import { formatDistanceToNow } from 'date-fns';

export const currentUser: RequestHandler = (req, res, next) => {
  if (req.user) {
    // Actually remove the password
    const { password, ...userWithoutPassword } = req.user as any;

    res.locals.currentUser = userWithoutPassword;
  }

  next(); // always call next()
};
