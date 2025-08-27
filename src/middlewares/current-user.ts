import { RequestHandler } from 'express';
import { PublicUserType } from '../types/user.js';

export const currentUser: RequestHandler = (req, res, next) => {
  console.log('You are into currentUser middleware...');

  if (req.user) {
    // Actually remove the password
    const { password, ...userWithoutPassword } = req.user as any;
    res.locals.currentUser = userWithoutPassword as PublicUserType;
  }

  console.log('You are about to leave currentUser middleware...');

  next(); // always call next()
};
