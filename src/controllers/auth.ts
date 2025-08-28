import bcrypt from 'bcrypt';
import passport from 'passport';
import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { RegisterFormData } from '../types/auth.js';
import { capitalize } from '../lib/utils.js';
import { createUser } from '../models/user.js';
import { PublicUserType } from '../types/user.js';

export const getRegisterForm: RequestHandler = (req, res) => {
  res.render('register', { errors: null, originalInput: null });
};

export const getLoginForm: RequestHandler = (req, res) => {
  res.render('login', { errors: null, originalInput: null });
};

export const registerNewUser: RequestHandler = async (req, res, next) => {
  // const errors = validationResult(req);

  // console.log('body:', req.body);

  // if (!errors.isEmpty()) {
  // 	Object.entries(errors.mapped()).forEach((error) => {
  // 		console.log(error);
  // 	});
  // 	return res
  // 		.status(400)
  // 		.render('register', { errors: errors.mapped(), data: req.body });
  // }

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
      saltRound,
    );

    await createUser(
      formattedFormData.first_name,
      formattedFormData.last_name,
      formattedFormData.username,
      hashedPassword,
    );

    res.status(201).redirect('/auth/login');
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  passport.authenticate(
    'local',
    (
      error: Error | null,
      user: PublicUserType | false | null,
      info: { message?: string } | undefined,
    ) => {
      if (error) return next(error);

      // Login failed
      if (!user) {
        console.log(`Failed login attempt for: ${req.body.username}`);

        return res.status(401).render('login', {
          errors: {
            auth: { msg: info?.message || 'Invalid username or password' },
          },
          originalInput: req.body,
        });
      }

      // Login user manually
      req.logIn(user, (error) => {
        if (error) {
          console.error('Login error:', error);

          return res.status(500).render('login', {
            errors: [{ msg: 'Login failed. Please try again.' }],
            originalInput: req.body,
          });
        }
        res.redirect('/');
      });
    },
  )(req, res, next);
};

export const logoutUser: RequestHandler = async (req, res, next) => {
  req.logOut((error) => {
    if (error) return next(error);

    res.redirect('/');
  });
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  res.render('profile');
};
