import {
  removeErrorStyleAndMessage,
  showErrorStyleAndMessage,
  validateFromServer,
} from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('#back-btn-on-upgrade');

  if (backButton) {
    backButton.addEventListener('click', () => {
      console.log('on click');
      window.history.back();
    });
  }

  // form control
  const form = document.querySelector('#upgrade-form');
  if (!form) return;

  const input = form.querySelector('input');
  const submitBtn = form.querySelector('button[type="submit"]');

  input.focus();

  validateFromServer(form);

  input.addEventListener('input', () => {
    removeErrorStyleAndMessage(input);
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    if (input.value.trim()) {
      removeErrorStyleAndMessage(input);

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      form.submit();
    } else {
      showErrorStyleAndMessage(input, 'Secret code is required');
      input.focus();
    }
  });
});
