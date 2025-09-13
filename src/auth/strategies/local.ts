import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByUsername } from '../../models/user.js';

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username: string, password: string, done) => {
    console.log('Start to login...');

    try {
      const user = await getUserByUsername(username);

      if (!user) {
        return done(null, false, {
          message: 'No user found with this username',
        });
      }

      console.log('Get user from database: ', user);

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }
  },
);
