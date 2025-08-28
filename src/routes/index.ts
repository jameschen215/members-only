import { Router } from 'express';
import { isAuthenticated } from '../auth/middleware.js';

export const router = Router();

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }

  res.render('index');
});
