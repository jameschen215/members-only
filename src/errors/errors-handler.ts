import { Request, Response, NextFunction } from 'express';
import { CustomBadRequestError } from './custom-bad-request-error.js';
import { CustomForbiddenError } from './custom-forbidden-error.js';
import { CustomInternalError } from './custom-internal-error.js';
import { CustomNotFoundError } from './custom-not-found-error.js';
import { CustomUnauthorizedError } from './custom-unauthorized-error.js';

export function errorsHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.log(error);

  if (
    error instanceof CustomBadRequestError ||
    error instanceof CustomForbiddenError ||
    error instanceof CustomInternalError ||
    error instanceof CustomNotFoundError ||
    error instanceof CustomUnauthorizedError
  ) {
    return res.status(error.statusCode).render('error', {
      title: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  // fallback for unexpected errors
  console.error('Unexpected error:', error);
  res.status(500).render('error', {
    title: 'InternalServerError',
    message: 'Something went wrong',
    statusCode: 500,
  });
}
