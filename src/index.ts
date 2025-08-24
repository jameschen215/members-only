import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { pool } from './db/pool.js';
import { runSetup } from './db/setup.js';
import { configurePassport } from './auth/passport.js';
import { router as authRoutes } from './routes/auth.js';

const app = express();
const pgSession = connectPgSimple(session);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with PostgreSQL store
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'dev',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24, // 1 day
		},
		store: new pgSession({
			pool: pool,
			tableName: 'user_sessions',
		}),
	})
);

// Configure and initialize Passport
const passport = configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (_req, res) => res.send(`<h1>Hey there, members!</h1>`));

app.use('/auth', authRoutes);

// Start Server
async function startServer() {
	const port = process.env.PORT || 3000;

	try {
		// Ensure database is set up before starting the server
		await runSetup();

		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error('Fail to start server: ', error);
		process.exit(1);
	}
}

startServer();
