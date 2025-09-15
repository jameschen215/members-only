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
    console.log('=== DESERIALIZE CALLED ===');
    console.log('ID to deserialize:', id, typeof id);

    try {
      const user = await getUserById(id as number);
      console.log(
        'Deserialize result:',
        user ? `Found: ${user.username}` : 'User not found',
      );

      if (!user) {
        console.log('WARNING: User not found during deserialization');
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      console.error('Deserialize error:', error);

      done(error);
    }
  });

  return passport;
}
