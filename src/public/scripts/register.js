import {
  focusOnFirstErrorField,
  removeErrorStyleAndMessage,
  validateAuthField,
  validateFromServer,
} from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#register-form');

  if (!form) return;

  const firstInput = form.querySelector('input');
  const submitButton = form.querySelector('button[type="submit"]');

  firstInput.focus();

  // Server side validation
  validateFromServer(form);

  // Client side validation
  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); // always prevent first

    let isValid = true;

    form.querySelectorAll('input').forEach((field) => {
      if (field.name === 'confirm_password') {
        const password = form.querySelector('input[name=password]').value;

        if (!validateAuthField(field, password)) isValid = false;
      } else {
        if (!validateAuthField(field)) isValid = false;
      }
    });

    if (isValid) {
      submitButton.disabled = true;
      submitButton.textContent = 'Registering...';
      // Manually submit only if valid
      form.submit();
    } else {
      focusOnFirstErrorField(form);
    }
  });

  // Remove error info when when user is typing
  form.querySelectorAll('input').forEach((field) => {
    field.addEventListener('input', () => removeErrorStyleAndMessage(field));
  });
});
