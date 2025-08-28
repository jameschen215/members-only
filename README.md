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
