import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByUsername } from '../../models/user.js';

export const localStrategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
	},
	async (username: string, password: string, done) => {
		try {
			const user = await getUserByUsername(username);

			if (!user) {
				return done(null, false, { message: 'No user found with the email' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return done(null, false, { message: 'Incorrect password' });
			}

			done(null, user);
		} catch (error) {
			done(error);
		}
	}
);
