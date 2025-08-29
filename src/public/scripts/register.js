import { MIN_PASSWORD_LENGTH } from './lib/constants';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#register-form');

  if (!form) return;

  const firstInput = form.querySelector('input');
  const submitButton = form.querySelector('button[type="submit"]');

  firstInput.focus();

  // Server validation
});
