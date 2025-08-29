import {
  focusOnFirstErrorField,
  removeErrorStyleAndMessage,
  validateAuthField,
  validateFromServer,
} from '/scripts/lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#login-form');

  if (!form) return;

  const firstInput = form.querySelector('input');
  const submitButton = form.querySelector('button[type="submit"]');

  firstInput.focus();

  // Server validation
  validateFromServer(form);

  // Client validation
  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); // always prevent first

    let isValid = true;

    // Re-select all inputs to make sure we have current ones
    form.querySelectorAll('input').forEach((field) => {
      if (!validateAuthField(field)) isValid = false;
    });

    if (isValid) {
      submitButton.disabled = true;
      submitButton.textContent = 'Logging in...';
      form.submit(); // manually submit only if valid
    } else {
      focusOnFirstErrorField(form);
    }
  });

  // Remove error info when user typing
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => removeErrorStyleAndMessage(input));
  });
});
