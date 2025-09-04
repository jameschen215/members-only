import { RequestHandler } from 'express';
import { format, formatDistanceToNowStrict } from 'date-fns';

export const formatDate: RequestHandler = (_req, res, next) => {
  res.locals.formatDate = format;
  res.locals.formatDistanceToNowStrict = formatDistanceToNowStrict;

  next();
};
