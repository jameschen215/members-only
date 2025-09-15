# Project: Members Only

## What I've learned

### Login Form Handling (SSR)

- Prevent double submissions:
  The login button is disabled immediately when the form is submitted to prevent repeated clicks or pressing Enter multiple times.

  ```JavaScript
  const form = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');

  form.addEventListener('submit', () => {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";
  });
  ```

- Enter key submission:
  Pressing Enter in any input field triggers the same form submit event as clicking the login button, so no special handling is needed.

- Server-side rendering (SSR):
  The server renders the login page `(res.render('login', { errors, originalInput }))` on both success and error, naturally resetting the button on page reload.

- Optional enhancement:
  A short cool down or a loading spinner can improve UX further.

## Submitting Form Data with JavaScript and Multer

When submitting forms via JavaScript using `FormData` and `fetch()`, there's an important difference in how the data is sent compared to traditional HTML form submissions.

### The Problem

Traditional HTML forms (without JavaScript intervention) submit as `application/x-www-form-urlencoded` by default, which Express can parse using `express.urlencoded({ extended: true })`. However, when using JavaScript's `FormData` object with `fetch()`:

```javascript
const formData = new FormData(form);
fetch('/endpoint', {
  method: 'POST',
  body: formData, // This forces multipart/form-data
});
```

The browser automatically sets the `Content-Type` to `multipart/form-data`, which Express's built-in parsers cannot handle. This results in `req.body` being `undefined` on the server side.

### The Solution: Multer Middleware

To handle `multipart/form-data`, you need the `multer` middleware:

1. **Install multer:**

   ```bash
   npm install multer
   ```

2. **Configure and apply the middleware:**

   ```javascript
   const multer = require('multer');
   const upload = multer();

   // For forms without file uploads, use upload.none()
   app.use(upload.none());

   // Or apply to specific routes:
   app.post(
     '/messages/create',
     upload.none(),
     [
       // your validation middleware
     ],
     yourController,
   );
   ```

### Key Learnings

- **Content-Type matters**: JavaScript `FormData` sends as `multipart/form-data`, not `application/x-www-form-urlencoded`
- **Express built-in parsers are limited**: `express.json()` and `express.urlencoded()` don't handle multipart data
- **Multer is specifically designed** for parsing `multipart/form-data`, even without file uploads
- **`FormData` appears empty in console**: Use `Object.fromEntries(formData.entries())` to inspect its contents
- **Server-side validation works normally** once multer is configured and `req.body` is properly populated

## EJS Templating

By default, EJS and other templating engines escape HTML characters to prevent XSS attacks. To render raw HTML, such as the `<mark>` tags I used for highlighting, I need to use `<%- variable %>` instead of the standard `<%= variable %>` syntax.

## JavaScript Event Handling

I learned about a common event-timing issue where a `blur` event on an input field can fire before a `click` event on another element. To solve this, I can use the `mousedown` event and call `event.preventDefault()` to prevent the blur from happening, allowing the click event to be executed.
[Code here](/src/public/scripts/explore.js)

## How to generate a session secret code in cli

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

## Railway Deployment: Session Authentication Issue

### Problem Overview

After deploying the Express.js application to Railway, user authentication failed despite working perfectly in the local development environment. Users could input correct credentials and the login process appeared successful (user data retrieved, password verified, session created), but immediately after redirect, the application showed "Not authenticated" status.

### Root Cause Analysis

The issue was caused by **secure session cookies not working with Railway's reverse proxy architecture**:

#### Railway's Infrastructure

- **External requests** → Railway's Load Balancer (HTTPS termination)
- **Internal communication** → Your Express app (HTTP)
- **Result**: Express doesn't recognize the original request was HTTPS

#### The Problem Chain

1. Session configured with `secure: true` (production setting)
2. Railway terminates SSL at the load balancer level
3. Express receives HTTP requests internally
4. Express refuses to set secure cookies over "HTTP"
5. Browser doesn't receive session cookie
6. Subsequent requests have no session data
7. Authentication fails despite successful login

### Debugging Process

The systematic debugging approach revealed:

#### What Was Working ✅

- Database connections
- Password verification (`bcrypt.compare` returned `true`)
- User serialization (`passport.serializeUser`)
- Session creation and database storage
- Login route logic

#### What Was Failing ❌

- Session cookie transmission to browser
- Session retrieval on subsequent requests
- User deserialization (`passport.deserializeUser` not called)
- Authentication state persistence

#### Key Diagnostic Steps

1. **Added comprehensive logging** to track session flow
2. **Verified database session storage** - sessions were correctly saved
3. **Tested cookie security settings** - `secure: false` immediately fixed the issue
4. **Identified proxy trust issue** - root cause discovered

### Solution Implementation

```javascript
// Critical fix for Railway deployment
app.set('trust proxy', 1); // Must be before session middleware

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Now works correctly
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
    },
    store: new pgSession({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
  }),
);
```

### Key Learnings

#### 1. Reverse Proxy Awareness

- **Cloud platforms** (Railway, Heroku, Render) use reverse proxies for SSL termination
- **Express applications** need `trust proxy` setting to detect original HTTPS requests
- **Security implications**: Without proper proxy trust, secure cookies fail silently

#### 2. Environment-Specific Issues

- **Local development** directly serves HTTPS or uses HTTP without secure cookies
- **Production deployment** architecture differences can break authentication
- **Configuration must account** for infrastructure differences

#### 3. Debugging Methodology

- **Systematic logging** at each step of the authentication flow
- **Database verification** to confirm session storage vs. retrieval issues
- **Environment variable testing** to isolate configuration problems
- **Step-by-step elimination** rather than assuming the obvious cause

#### 4. Railway-Specific Considerations

- **Automatic HTTPS** provided for all deployments
- **Load balancer** handles SSL termination transparently
- **Internal HTTP communication** requires proxy trust configuration
- **PostgreSQL integration** works seamlessly with session storage

#### 5. Security vs. Functionality Balance

- **Secure cookies** are essential for production security
- **Proxy trust settings** must be configured correctly for secure cookies to work
- **Never compromise security** by permanently disabling secure cookies
- **Platform-specific configuration** is often required for proper security

### Best Practices Established

1. **Always configure `trust proxy`** for cloud deployments
2. **Test authentication thoroughly** in production-like environments
3. **Implement comprehensive logging** for authentication flows
4. **Understand your deployment platform's** infrastructure architecture
5. **Verify session persistence** separately from login logic
6. **Use environment-specific configurations** while maintaining security standards

This issue highlighted the importance of understanding deployment platform architecture and the need for environment-specific configuration when building production-ready applications.
