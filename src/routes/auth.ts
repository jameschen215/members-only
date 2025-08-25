import { Router } from 'express';
import {
	getLoginForm,
	getRegisterForm,
	loginUser,
	logoutUser,
	registerNewUser,
} from '../controllers/auth.js';
import { isAuthenticated, isNotAuthenticated } from '../auth/middleware.js';
import passport from 'passport';
import { registerSchema } from '../validators/userSchema.js';

export const router = Router();

router.post('/register', isNotAuthenticated, registerSchema, registerNewUser);

router.post(
	'/login',
	isNotAuthenticated,
	passport.authenticate('local', { failureMessage: true }),
	loginUser
);

router.post('/logout', isAuthenticated, logoutUser);

router.get('/register', getRegisterForm);

router.get('/login', getLoginForm);
