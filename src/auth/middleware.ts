import { RequestHandler } from 'express';
import { UserType } from '../types/user.js';

export const isAuthenticated: RequestHandler = (req, res, next) => {
	if (req.isAuthenticated()) return next();

	res.status(401).json({ message: 'Unauthorized' });
};

export const isNotAuthenticated: RequestHandler = (req, res, next) => {
	if (!req.isAuthenticated()) return next();

	res.status(400).json({ message: 'You are already logged in' });
};

export const requireRole = (roles: string[]) => {
	const fn: RequestHandler = (req, res, next) => {
		if (!req.isAuthenticated()) {
			return res.status(401).json({ message: 'Authentication required' });
		}

		// Assuming user has a role property
		const userRole = (req.user as UserType).role;

		if (roles.includes(userRole)) return next();

		res.status(403).json({ message: 'Insufficient permissions' });
	};

	return fn;
};
