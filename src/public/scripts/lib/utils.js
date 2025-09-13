import { MIN_PASSWORD_LENGTH } from './constants.js';

// Show server validation results
export function validateFromServer(form) {
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

  focusOnFirstErrorField(form);
}

// Validate auth field
export function validateAuthField(field, password = '') {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  switch (field.name) {
    case 'first_name':
    case 'last_name':
      if (!value) {
        isValid = false;
        errorMessage =
          field.name === 'first_name'
            ? 'First name is required'
            : 'Last name is required';
      } else if (value.length < 2 || value.length > 25) {
        isValid = false;
        errorMessage = 'Name must be between 2 and 25 characters';
      } else if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) {
        isValid = false;
        errorMessage =
          'Name can only contain letters, spaces, hyphens, or apostrophes.';
      }
      break;

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

    case 'confirm_password':
      if (!value) {
        isValid = false;
        errorMessage = 'Confirm password is required';
      } else {
        if (password !== value) {
          isValid = false;
          errorMessage = 'Passwords do not match';
        }
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

// Validate message field
export function validatePostField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  switch (field.name) {
    case 'title':
      if (!value) {
        isValid = false;
        errorMessage = 'Title is required';
      }
      break;

    case 'content':
      if (!value) {
        isValid = false;
        errorMessage = 'Content is required';
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

export function removeErrorStyleAndMessage(field) {
  // Remove error styles on field
  field.classList.remove('bg-red-50', 'border-red-500', 'focus:ring-red-50');
  field.classList.add(
    'border-zinc-100',
    'focus:border-sky-500',
    'focus:ring-sky-50',
  );

  // Remove error message about field
  const existingErrorMessage = field.parentNode.querySelector('[id$=error]');
  if (existingErrorMessage) {
    existingErrorMessage.remove();
  }

  // Get field help info back and set aria-describedby
  const helpInfo = field.parentNode.querySelector('[id$=help]');
  if (helpInfo) {
    helpInfo.style.display = 'block';
    field.setAttribute('aria-describedby', `${field.name}-help`);
  } else {
    field.setAttribute('aria-describedby', '');
  }
}

export function showErrorStyleAndMessage(field, message) {
  // Remove existing error style and message
  removeErrorStyleAndMessage(field);

  // Add new error style
  field.classList.remove(
    'border-zinc-100',
    'focus:border-sky-500',
    'focus:ring-sky-50',
  );

  field.classList.add('bg-red-50', 'border-red-500', 'focus:ring-red-50');

  // set aria-describedby
  field.setAttribute('aria-describedby', `${field.name}-error`);

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

export function focusOnFirstErrorField(form) {
  const firstErrorField = form.querySelector('.border-red-500');

  if (firstErrorField) {
    firstErrorField.focus();
    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Handle message deletion dropdown on home page or profile page
export function handleMessageDeletionDropdown() {
  const dropdownTriggers = document.querySelectorAll(
    '[id^="dropdown-trigger-"]',
  );

  if (dropdownTriggers.length === 0) return;

  document.addEventListener('click', (ev) => {
    if (ev.target.closest('[id^="dropdown-trigger-"]')) {
      const trigger = ev.target.closest('[id^="dropdown-trigger-"]');
      const dropdownMenuId = 'dropdown-menu-' + trigger.id.split('-').at(-1);

      trigger.setAttribute('aria-expanded', true);
      showDropdownById(dropdownMenuId);
    } else if (ev.target.closest('[id^="dropdown-menu-"] form button')) {
      trigger.setAttribute('aria-expanded', false);
      hideAllDropdownMenu();
    } else if (!ev.target.closest('[id^="dropdown-menu-"]')) {
      trigger.setAttribute('aria-expanded', false);
      hideAllDropdownMenu();
    }
  });

  function showDropdownById(id) {
    // Hide all dropdown menus if exist
    hideAllDropdownMenu();

    // Show the current clicked dropdown menu
    document.getElementById(id).classList.remove('hidden');
  }

  function hideAllDropdownMenu() {
    document.querySelectorAll('[id^="dropdown-menu-"]').forEach((dm) => {
      dm.classList.add('hidden');
    });
  }
}
