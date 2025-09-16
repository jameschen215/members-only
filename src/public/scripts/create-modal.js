import {
  removeErrorStyleAndMessage,
  showErrorStyleAndMessage,
} from './lib/utils.js';

const ANIMATION_DURATION = 200;

document.addEventListener('DOMContentLoaded', () => {
  const postTrigger = document.querySelector('#post-trigger');
  const postTriggerFixed = document.querySelector('#post-trigger-fixed');
  const modal = document.querySelector('#create-modal');
  const formContainer = document.querySelector('#form-container');
  const form = document.querySelector('#create-form');
  const cancelBtn = document.querySelector('#cancel-post-btn');
  const postBtn = document.querySelector('#submit-post-btn');

  let isPosting = false;

  if (postTrigger) {
    postTrigger.addEventListener('click', showModal);
  }

  if (postTriggerFixed) {
    postTriggerFixed.addEventListener('click', showModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  // Client side validation
  handleFormInput(form);

  // Server side validation
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    if (isPosting) return;

    isPosting = true;
    postBtn.disabled = true;
    postBtn.textContent = 'Posting...';

    const formData = new FormData(form);

    const res = await fetch('/messages/create', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (data.errors) {
      for (const [fieldName, error] of Object.entries(data.errors)) {
        const field = form.querySelector(`[name=${fieldName}]`);
        // field.value = data.oldInput[fieldName];
        removeErrorStyleAndMessage(field);
        showErrorStyleAndMessage(field, error.msg);
      }
    } else {
      closeModal();

      if (location.pathname === '/' || location.pathname.includes('profile')) {
        location.reload();
      } else {
        location.href = '/';
      }
    }
  });

  // Remove error info when user is typing
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => removeErrorStyleAndMessage(field));
  });

  function showModal() {
    document.querySelector('nav').setAttribute('inert', '');
    document.querySelector('main').setAttribute('inert', '');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
      formContainer.classList.remove('opacity-0', 'scale-95');
    });

    requestAnimationFrame(() => modal.querySelector('input').focus());

    // handle keydown input
    document.addEventListener('keydown', handleKeyboardInput);
  }

  function closeModal() {
    document.querySelector('nav').removeAttribute('inert');
    document.querySelector('main').removeAttribute('inert');

    formContainer.classList.add('opacity-0', 'scale-95'); // animate out

    setTimeout(() => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');

      document.removeEventListener('keydown', handleKeyboardInput);
    }, ANIMATION_DURATION);
  }

  function handleKeyboardInput(ev) {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      closeModal();
    }
  }

  // handle form input
  function handleFormInput(form) {
    if (!form) return;

    // const firstInput = form.querySelector('input, textarea');
    const allFields = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('button[type="submit"]');

    checkFormValidity();

    allFields.forEach((field) =>
      field.addEventListener('input', checkFormValidity),
    );

    function checkFormValidity() {
      let isValid = true;

      allFields.forEach((field) => {
        if (field.value.trim() === '') {
          isValid = false;
        }
      });

      submitBtn.disabled = !isValid;
    }
  }
});
