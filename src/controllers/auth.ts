import { RequestHandler } from 'express';

export const getRegisterForm: RequestHandler = (req, res) => {
	res.send('Register Form');
};

export const getLoginForm: RequestHandler = (req, res) => {
	res.send('Login Form');
};

export const registerNewUser: RequestHandler = async (req, res, next) => {};

export const loginUser: RequestHandler = async (req, res, next) => {};

export const logoutUser: RequestHandler = async (req, res, next) => {};
