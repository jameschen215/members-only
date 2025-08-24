import { Router } from 'express';
import {
	getRegisterForm,
	loginUser,
	logoutUser,
	registerNewUser,
} from '../controllers/auth.js';
import { isAuthenticated, isNotAuthenticated } from '../auth/middleware.js';
import passport from 'passport';

export const router = Router();

router.post('/register', isNotAuthenticated, registerNewUser);

router.post(
	'/login',
	isNotAuthenticated,
	passport.authenticate('local', { failureMessage: true }),
	loginUser
);

router.post('/logout', isAuthenticated, logoutUser);

router.get('/register', getRegisterForm);

router.get('/login', getRegisterForm);
