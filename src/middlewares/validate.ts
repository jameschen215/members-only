import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export function validate(view: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render(view, {
        errors: errors.mapped(),
        oldInput: req.body,
      });
    }

    next();
  };
}
