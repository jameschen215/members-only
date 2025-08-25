import { checkSchema } from 'express-validator';
import { getUserByUsername } from '../models/user.js';

export const registerSchema = checkSchema({
	first_name: {
		in: ['body'],
		isString: true,
		trim: true,
		notEmpty: {
			errorMessage: 'First name is required',
		},
		isLength: {
			options: { min: 2, max: 50 },
			errorMessage: 'First name must be between 2 and 50 characters',
		},
	},
	last_name: {
		in: ['body'],
		isString: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Last name is required',
		},
		isLength: {
			options: { min: 2, max: 50 },
			errorMessage: 'Last name must be between 2 and 50 characters',
		},
	},
	username: {
		in: ['body'],
		isString: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Username is required',
		},
		isEmail: {
			errorMessage: 'Invalid email format',
		},
		normalizeEmail: true,
		custom: {
			options: async (value) => {
				const existingUser = await getUserByUsername(value);
				if (existingUser) {
					throw new Error('An account with this email already exists');
				}
				return true;
			},
		},
	},
	password: {
		in: ['body'],
		isString: true,
		notEmpty: {
			errorMessage: 'Password is required',
		},
		isLength: {
			options: { min: 8 },
			errorMessage: 'Password must be at least 8 characters long',
		},
		matches: {
			options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
			errorMessage:
				'Password must include uppercase, lowercase, number, and special character',
		},
	},
	confirm_password: {
		in: ['body'],
		notEmpty: {
			errorMessage: 'Confirm password is required',
		},
		custom: {
			options: (value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Passwords do not match');
				}
				return true;
			},
		},
	},
});

export const loginSchema = checkSchema({
	username: {
		in: ['body'],
		isString: true,
		trim: true,
		notEmpty: {
			errorMessage: 'Username is required',
		},
		isEmail: {
			errorMessage: 'Invalid email format',
		},
		normalizeEmail: true,
	},
	password: {
		in: ['body'],
		isString: true,
		notEmpty: {
			errorMessage: 'Password is required',
		},
	},
});
