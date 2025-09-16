import {
  focusOnFirstErrorField,
  removeErrorStyleAndMessage,
  validateAuthField,
  validateFromServer,
} from '/scripts/lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#login-form');
  let isLogging = false;

  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const registerLink = form.querySelector('p a');

  // Server validation
  validateFromServer(form);

  // Client validation
  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); // always prevent first

    if (isLogging) return;

    isLogging = true;

    let isValid = true;

    // Re-select all inputs to make sure we have current ones
    form.querySelectorAll('input').forEach((field) => {
      if (!validateAuthField(field)) isValid = false;
    });

    if (isValid) {
      submitButton.disabled = true;
      submitButton.textContent = 'Logging in...';
      registerLink.classList.add(
        'pointer-events-none',
        'text-zinc-400',
        'cursor-default',
      );
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
