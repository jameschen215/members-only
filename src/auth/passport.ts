import passport from 'passport';

import { UserType } from '../types/user.js';
import { getUserById } from '../models/user.js';
import { localStrategy } from './strategies/local.js';

export function configurePassport() {
  // Configure strategy
  passport.use(localStrategy);

  // Serialize user for the session
  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as UserType).id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id as number);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  return passport;
}
