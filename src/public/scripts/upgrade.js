import {
  removeErrorStyleAndMessage,
  showErrorStyleAndMessage,
  validateFromServer,
} from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // form control
  const form = document.querySelector('#upgrade-form');
  if (!form) return;

  const input = form.querySelector('input');
  const submitBtn = form.querySelector('button[type="submit"]');
  let isUpgrading = false;

  validateFromServer(form);

  input.addEventListener('input', () => {
    removeErrorStyleAndMessage(input);
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    if (isUpgrading) return;

    if (input.value.trim()) {
      removeErrorStyleAndMessage(input);

      isUpgrading = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      form.submit();
    } else {
      showErrorStyleAndMessage(input, 'Secret code is required');
      input.focus();
    }

    isUpgrading = false;
  });
});
