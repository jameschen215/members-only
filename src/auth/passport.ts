import passport from 'passport';

import { UserType } from '../types/user.js';
import { getUserById } from '../models/user.js';
import { localStrategy } from './strategies/local.js';

export function configurePassport() {
  // Configure strategy
  passport.use(localStrategy);

  // Serialize user for the session
  passport.serializeUser((user: Express.User, done) => {
    console.log('Serializing user:', (user as UserType).id); // Add this log

    done(null, (user as UserType).id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user ID:', id); // Add this log
      const user = await getUserById(id as number);
      console.log('Deserialized user:', user ? user.username : 'not found'); // Add this log
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  return passport;
}
