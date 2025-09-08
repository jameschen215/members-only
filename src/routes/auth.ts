import { Router } from 'express';

import {
  getAllUsersPage,
  getLandingPage,
  getLoginForm,
  getRegisterForm,
  getUpgradeRoleForm,
  getUserProfile,
  loginUser,
  logoutUser,
  registerNewUser,
  upgradeUser,
} from '../controllers/auth.js';
import {
  isAuthenticated,
  isNotAuthenticated,
  requireRole,
} from '../auth/middleware.js';
import { loginSchema, registerSchema } from '../validators/userSchema.js';
import { validate } from '../middlewares/validate.js';
import { secretCodeSchema } from '../validators/secretCodeSchema.js';

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

router.post(
  '/upgrade',
  isAuthenticated,
  secretCodeSchema,
  validate('upgrade'),
  upgradeUser,
);

router.post('/logout', isAuthenticated, logoutUser);

router.get('/landing-page', getLandingPage);

router.get('/register', getRegisterForm);

router.get('/login', getLoginForm);

router.get('/users', requireRole(['admin']), getAllUsersPage);

router.get('/users/:userId/profile', isAuthenticated, getUserProfile);

router.get('/upgrade', isAuthenticated, getUpgradeRoleForm);
