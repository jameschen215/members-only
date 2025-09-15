import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import { fileURLToPath } from 'url';
import session from 'express-session';
import compression from 'compression';
import methodOverride from 'method-override';
import connectPgSimple from 'connect-pg-simple';
import expressEjsLayouts from 'express-ejs-layouts';

import { pool } from './db/pool.js';
import { runSetup } from './db/setup.js';
import { configurePassport } from './auth/passport.js';
import { router as authRoutes } from './routes/auth.js';
import { router as indexRoutes } from './routes/index.js';
import { formatDate } from './middlewares/format-date.js';
import { errorsHandler } from './errors/errors-handler.js';
import { currentUser } from './middlewares/current-user.js';
import { setCurrentPath } from './middlewares/current-path.js';
import { CustomNotFoundError } from './errors/custom-not-found-error.js';
import { UserType } from './types/user.js';

// ------------------ debug ------------------
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user: any;
    };
  }
}
// ------------------ debug ------------------

const app = express();
const upload = multer(); // handle form data upload from js
const pgSession = connectPgSimple(session);

// Configure ejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressEjsLayouts);
app.set('layout', 'layout');
app.set('view options', {
  rmWhitespace: true, // Remove whitespace
  cache: process.env.NODE_ENV === 'production',
});

// Enable view caching in production to improve performance
if (process.env.NODE_ENV === 'production') {
  app.set('view cache', true);
}

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use a middleware created by Multer that only accepts text fields, not files.
app.use(upload.none());
app.use(formatDate);
app.use(setCurrentPath);
app.use(methodOverride('_method')); // allows ?_method=DELETE

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
      errorLog: (error) => {
        console.error('Session store error: ', error);
      },
    }),
  }),
);

// -------------------- debug test --------------------

// Add this after session middleware but before routes
app.use((req, res, next) => {
  if (req.path.startsWith('/auth/login') && req.method === 'POST') {
    console.log('=== LOGIN REQUEST ===');
    console.log('Session before:', req.session);
    console.log('User before:', req.user);
  }
  next();
});

app.use((req, res, next) => {
  if (req.path === '/' && req.user) {
    console.log('=== PROTECTED ROUTE ACCESS ===');
    console.log('Session:', req.session);
    console.log('User:', req.user);
  }
  next();
});

// -------------------- debug test --------------------

// Configure and initialize Passport
const passport = configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// 4. Your currentUser middleware (after Passport, before routes)
app.use(currentUser);

// Routes
app.use('/', indexRoutes);

app.use('/auth', authRoutes);

// -------------------- debug test --------------------
app.get('/session-info', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    cookies: req.headers.cookie,
  });
});

// Add this to see what happens on the redirected request
app.use((req, res, next) => {
  if (req.path === '/' || req.path.startsWith('/auth')) {
    console.log(`=== ${req.method} ${req.path} ===`);
    console.log('Session ID:', req.sessionID);
    console.log('Session exists:', !!req.session);
    console.log('Session passport:', req.session?.passport);
    console.log(
      'req.user:',
      req.user ? `User ID: ${(req.user as UserType).id}` : 'undefined',
    );
    console.log('isAuthenticated():', req.isAuthenticated());
    console.log('Cookies received:', req.headers.cookie);
    console.log('=================');
  }
  next();
});

// Check if session cookie is being set correctly
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data: any): typeof res {
    if (req.path === '/auth/login' && req.method === 'POST') {
      console.log('=== RESPONSE HEADERS ===');
      console.log('Set-Cookie:', res.getHeaders()['set-cookie']);
      console.log('Location:', res.getHeaders().location);
    }
    return originalSend.call(this, data);
  };
  next();
});

app.get('/test-auth-status', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    sessionData: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    passport: req.session?.passport,
  });
});

app.use((req, res, next) => {
  console.log('=== REQUEST DETAILS ===');
  console.log('Path:', req.path);
  console.log('Session ID:', req.sessionID);
  console.log('Cookies received:', req.headers.cookie);
  console.log('Session exists:', !!req.session);
  console.log(
    'Session keys:',
    req.session ? Object.keys(req.session) : 'no session',
  );
  console.log('=====================');
  next();
});
// -------------------- debug test --------------------

// handle other routes with not found
app.use((_req, _res, _next) => {
  throw new CustomNotFoundError('Page Not Found');
});

// Error handling
app.use(errorsHandler);

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
