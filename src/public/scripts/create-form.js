import {
  focusOnFirstErrorField,
  removeErrorStyleAndMessage,
  validateFromServer,
  validatePostField,
} from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#create-form');

  if (!form) return;

  const firstInput = form.querySelector('input, textarea');
  const submitBtn = form.querySelector('button[type="submit"]');

  firstInput.focus();

  // Server validation
  validateFromServer(form);

  // Client validation
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    let isValid = true;

    form.querySelectorAll('input, textarea').forEach((field) => {
      if (!validatePostField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';
      form.submit();
    } else {
      focusOnFirstErrorField(form);
    }
  });

  // Remove error info when user is typing
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => removeErrorStyleAndMessage(field));
  });
});
