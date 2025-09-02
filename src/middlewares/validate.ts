import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomBadRequestError } from '../errors/custom-bad-request-error.js';

export function validate(view: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      if (view === 'create-form') {
        throw new CustomBadRequestError('Title or content can not be empty');
      }

      return res.status(400).render(view, {
        errors: errors.mapped(),
        oldInput: req.body,
      });
    }

    next();
  };
}
