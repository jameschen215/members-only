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
    console.log('Input password length:', password.length);
    console.log('Input password (first 10 chars):', password.substring(0, 10));

    try {
      const user = await getUserByUsername(username);

      if (!user) {
        return done(null, false, {
          message: 'No user found with this username',
        });
      }

      console.log('Get user from database: ', user);
      console.log(
        'Stored hash (first 20 chars):',
        user.password.substring(0, 20),
      );

      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);

      if (!isMatch) {
        console.log('Password comparison failed');
        return done(null, false, { message: 'Incorrect password' });
      }

      console.log('Password comparison successful');

      return done(null, user);
    } catch (error) {
      console.log('LocalStrategy error:', error);

      done(error);
    }
  },
);
