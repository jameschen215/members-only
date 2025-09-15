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
    console.log('=== DESERIALIZE START ===');
    console.log('Deserializing user ID:', id);
    console.log('ID type:', typeof id);

    try {
      const user = await getUserById(id as number);
      console.log(
        'Found user:',
        user ? `${user.username} (ID: ${user.id})` : 'null',
      );
      console.log('=== DESERIALIZE END ===');

      done(null, user);
    } catch (error) {
      console.error('Deserialize error:', error);

      done(error);
    }
  });

  return passport;
}
