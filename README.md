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
