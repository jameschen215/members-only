const MIN_PASSWORD_LENGTH = 6;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#login-form');

  if (!form) return;

  const firstInput = form.querySelector('input');
  const submitButton = form.querySelector('button');

  firstInput.focus();

  // Server validation
  validateFromServer();

  const allFields = form.querySelectorAll('input');

  // Client validation
  form.addEventListener('submit', (ev) => {
    let isValid = true;

    allFields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      ev.preventDefault();
      focusOnFirstErrorField();
    } else {
      submitButton.disabled = true;
      submitButton.textContent = 'Logging in...';
    }
  });

  // Remove error info when user typing
  allFields.forEach((input) => {
    input.addEventListener('input', () => removeErrorStyleAndMessage(input));
  });

  // Server validation
  function validateFromServer() {
    const errors = JSON.parse(form.dataset.errors);

    if (!errors || Object.keys(errors).length === 0) return;

    for (let [name, error] of Object.entries(errors)) {
      if (name === 'auth') {
        if (error.msg.includes('username')) {
          name = 'username';
        } else {
          name = 'password';
        }
      }

      const field = document.querySelector(`#${name}`);
      showErrorStyleAndMessage(field, error.msg);
    }

    focusOnFirstErrorField();
  }

  // Validate field from client
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.name) {
      case 'username':
        if (!value) {
          isValid = false;
          errorMessage = 'Username is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) {
          isValid = false;
          errorMessage = 'Incorrect email address';
        }
        break;

      case 'password':
        if (!value) {
          isValid = false;
          errorMessage = 'Password is required';
        } else if (value.length < MIN_PASSWORD_LENGTH) {
          isValid = false;
          errorMessage = 'Password must be at least 6 characters long';
        }
        break;
    }

    if (isValid) {
      removeErrorStyleAndMessage(field);
    } else {
      showErrorStyleAndMessage(field, errorMessage);
    }

    return isValid;
  }

  function removeErrorStyleAndMessage(field) {
    // Remove error styles on field
    field.classList.remove('bg-red-50', 'border-red-500', 'focus:ring-red-50');
    field.classList.add(
      'border-zinc-200',
      'focus:border-sky-500',
      'focus:ring-sky-50',
    );

    // Remove error message about field
    const existingErrorMessage = field.parentNode.querySelector('[id$=error]');
    if (existingErrorMessage) {
      existingErrorMessage.remove();
    }

    // Get field help info back
    const helpInfo = field.parentNode.querySelector('[id$=help]');
    if (helpInfo) {
      helpInfo.style.display = 'block';
    }
  }

  function showErrorStyleAndMessage(field, message) {
    // Remove existing error style and message
    removeErrorStyleAndMessage(field);

    // Add new error style
    field.classList.remove(
      'border-zinc-200',
      'focus:border-sky-500',
      'focus:ring-sky-50',
    );

    field.classList.add('bg-red-50', 'border-red-500', 'focus:ring-red-50');

    // Add new error message
    if (message) {
      const helpInfo = field.parentNode.querySelector('[id$=help]');
      if (helpInfo) {
        helpInfo.style.display = 'none';
      }

      const errorElement = document.createElement('p');
      errorElement.id = `${field.name}-error`;
      errorElement.className = 'text-sm text-red-600 mt-2';
      errorElement.innerHTML = message;

      field.parentNode.appendChild(errorElement);
    }
  }

  function focusOnFirstErrorField() {
    const firstErrorField = form.querySelector('.border-red-500');

    if (firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});
