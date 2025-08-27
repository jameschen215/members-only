import { Router } from 'express';
import passport from 'passport';

import {
  getLoginForm,
  getRegisterForm,
  getUserProfile,
  loginUser,
  logoutUser,
  registerNewUser,
} from '../controllers/auth.js';
import { isAuthenticated, isNotAuthenticated } from '../auth/middleware.js';
import { loginSchema, registerSchema } from '../validators/userSchema.js';
import { validate } from '../middlewares/validate.js';

export const router = Router();

router.post(
  '/register',
  isNotAuthenticated,
  registerSchema,
  validate('register'),
  registerNewUser,
);

router.post(
  '/login',
  isNotAuthenticated,
  loginSchema,
  validate('login'),
  loginUser,
);

router.post('/logout', isAuthenticated, logoutUser);

router.get('/register', getRegisterForm);

router.get('/login', getLoginForm);

router.get('/profile', isAuthenticated, getUserProfile);
