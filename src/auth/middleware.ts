import { RequestHandler } from 'express';
import { UserType } from '../types/user.js';
import { CustomUnauthorizedError } from '../errors/custom-unauthorized-error.js';
import { CustomBadRequestError } from '../errors/custom-bad-request-error.js';
import { CustomForbiddenError } from '../errors/custom-forbidden-error.js';

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log('Not authenticated');
    res.status(401).redirect('/auth/landing-page');
  }
};

export const isNotAuthenticated: RequestHandler = (req, _res, next) => {
  if (!req.isAuthenticated()) return next();

  // res.status(400).json({ message: 'You are already logged in' });
  throw new CustomBadRequestError('You are already logged in');
};

export const requireRole = (roles: string[]) => {
  const fn: RequestHandler = (req, _res, next) => {
    if (!req.isAuthenticated()) {
      // return res.status(401).json({ message: 'Authentication required' });
      throw new CustomUnauthorizedError('Authentication required');
    }

    // Assuming user has a role property
    const userRole = (req.user as UserType).role;

    if (roles.includes(userRole)) return next();

    // res.status(403).json({ message: 'Insufficient permissions' });
    throw new CustomForbiddenError('Insufficient permissions');
  };

  return fn;
};
