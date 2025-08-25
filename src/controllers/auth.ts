import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { matchedData, validationResult } from 'express-validator';

import { RegisterFormData } from '../types/auth.js';
import { capitalize } from '../lib/utils.js';
import { createUser } from '../models/user.js';

export const getRegisterForm: RequestHandler = (req, res) => {
	res.render('register', { errors: null, data: null });
};

export const getLoginForm: RequestHandler = (req, res) => {
	res.render('login', { errors: null, data: null });
};

export const registerNewUser: RequestHandler = async (req, res, next) => {
	const errors = validationResult(req);

	console.log('body:', req.body);

	if (!errors.isEmpty()) {
		Object.entries(errors.mapped()).forEach((error) => {
			console.log(error);
		});
		return res
			.status(400)
			.render('register', { errors: errors.mapped(), data: req.body });
	}

	const formData = matchedData(req) as RegisterFormData;
	const formattedFormData = {
		...formData,
		first_name: capitalize(formData.first_name),
		last_name: capitalize(formData.last_name),
	};

	console.log(formattedFormData);

	try {
		const saltRound = 10;
		const hashedPassword = await bcrypt.hash(
			formattedFormData.password,
			saltRound
		);

		await createUser(
			formattedFormData.first_name,
			formattedFormData.last_name,
			formattedFormData.username,
			hashedPassword
		);

		res.status(201).redirect('/auth/login');
	} catch (error) {
		next(error);
	}
};

export const loginUser: RequestHandler = async (req, res, next) => {};

export const logoutUser: RequestHandler = async (req, res, next) => {};
