import {
  removeErrorStyleAndMessage,
  showErrorStyleAndMessage,
  validateFromServer,
} from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // const backButton = document.querySelector('#back-btn-on-upgrade');

  // if (backButton) {
  //   backButton.addEventListener('click', () => {
  //     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  //     if (isMobile) {
  //       // Use location-based navigation for mobile
  //       window.location.href = document.referrer || '/';
  //     } else {
  //       // Use history.back() for desktop
  //       window.history.back();
  //     }

  //     // console.log('on click');
  //     // window.history.back();
  //   });
  // }

  // form control
  const form = document.querySelector('#upgrade-form');
  if (!form) return;

  const input = form.querySelector('input');
  const submitBtn = form.querySelector('button[type="submit"]');

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
