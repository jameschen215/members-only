import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import expressEjsLayouts from 'express-ejs-layouts';

import { pool } from './db/pool.js';
import { runSetup } from './db/setup.js';
import { configurePassport } from './auth/passport.js';
import { router as indexRoutes } from './routes/index.js';
import { router as authRoutes } from './routes/auth.js';

const app = express();
const pgSession = connectPgSimple(session);

// Configure ejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('dirname: ', __dirname);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressEjsLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/', indexRoutes);

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
