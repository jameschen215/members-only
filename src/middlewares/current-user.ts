import { RequestHandler } from 'express';
import { PublicUserType } from '../types/user.js';
import { formatDate } from '../lib/utils.js';

export const currentUser: RequestHandler = (req, res, next) => {
  if (req.user) {
    // Actually remove the password
    const { password, ...userWithoutPassword } = req.user as any;

    res.locals.currentUser = userWithoutPassword;
    res.locals.formatDate = formatDate;
  }

  next(); // always call next()
};
