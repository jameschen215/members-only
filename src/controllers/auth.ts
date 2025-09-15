import bcrypt from 'bcrypt';
import passport from 'passport';
import { cache, invalidateUserCaches } from '../lib/cache.js';
import { RequestHandler } from 'express';
import { matchedData } from 'express-validator';

import { RegisterFormData } from '../types/auth.js';
import { capitalize } from '../lib/utils.js';
import {
  createUser,
  getAllUsers,
  getUserById,
  upgradeUserRole,
} from '../models/user.js';
import { PublicUserType } from '../types/user.js';
import { getMessagesByUserId } from '../models/message.js';

export const getRegisterForm: RequestHandler = (req, res) => {
  res.render('register', { errors: null, originalInput: null });
};

export const getLoginForm: RequestHandler = (req, res) => {
  res.render('login', { errors: null, originalInput: null });
};

export const registerNewUser: RequestHandler = async (req, res, next) => {
  const formData = matchedData(req) as RegisterFormData;
  const formattedFormData = {
    ...formData,
    first_name: capitalize(formData.first_name),
    last_name: capitalize(formData.last_name),
  };

  try {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(
      formattedFormData.password,
      saltRound,
    );

    const newUser = await createUser(
      formattedFormData.first_name,
      formattedFormData.last_name,
      formattedFormData.username,
      hashedPassword,
    );

    // Invalidate book cache
    invalidateUserCaches(newUser.id);

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
      if (error) {
        console.error('Login failed: ', error);

        return next(error);
      }

      // Login failed
      if (!user) {
        return res.status(401).render('login', {
          errors: {
            auth: { msg: info?.message || 'Invalid username or password' },
          },
          oldInput: req.body,
        });
      }

      // Login user manually
      req.logIn(user, (error) => {
        if (error) {
          console.error('req.logIn error:', error);

          return res.status(500).render('login', {
            errors: [{ msg: 'Login failed. Please try again.' }],
            oldInput: req.body,
          });
        }

        console.log('Login successful, user logged in:', user.id);
        console.log('Session after login:', req.session);
        console.log('req.user after login:', req.user);

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
  const userId = Number(req.params.userId);
  let user: PublicUserType | undefined = undefined;

  const cacheKey = `profile_${userId}`;
  const profile = cache.get(cacheKey);

  if (profile) {
    return res.render('profile', profile);
  }

  try {
    if (res.locals.currentUser.id === userId) {
      user = res.locals.currentUser;
    } else {
      const userWithPassword = await getUserById(userId);
      if (userWithPassword) {
        const { password, ...userWithoutPassword } = userWithPassword;
        user = {
          ...userWithoutPassword,
          avatar:
            userWithoutPassword.first_name.charAt(0) +
            userWithoutPassword.last_name.charAt(0),
        };
      }
    }

    const messages = await getMessagesByUserId(userId);
    const messagesWithAuthor = messages.map((msg) => ({
      ...msg,
      author: user,
    }));

    cache.set(cacheKey, { user, messages: messagesWithAuthor });

    res.render('profile', { user, messages: messagesWithAuthor });
  } catch (error) {
    next(error);
  }
};

export const getLandingPage: RequestHandler = (_req, res) => {
  res.render('landing-page');
};

export const getAllUsersPage: RequestHandler = async (_req, res, next) => {
  const cacheKey = 'all_users';
  const cachedUsers = cache.get(cacheKey);

  if (cachedUsers) {
    return res.render('users', { users: cachedUsers as PublicUserType[] });
  }

  try {
    const users = await getAllUsers();

    cache.set(cacheKey, users);

    res.render('users', { users });
  } catch (error) {
    next(error);
  }
};

export const getUpgradeRoleForm: RequestHandler = (req, res, next) => {
  res.render('upgrade', { oldInput: null, errors: null });
};

export const upgradeUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await upgradeUserRole(res.locals.currentUser);

    if (user) {
      // Invalidate book cache
      invalidateUserCaches(user.id);
    }

    res.redirect(`/auth/users/${res.locals.currentUser.id}/profile`);
  } catch (error) {
    next(error);
  }
};
