// explore.js

import { handleMessageDeletionDropdown } from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#search-form');

  if (!form) return;

  const searchInput = form.querySelector('input');
  const clearButton = form.querySelector('button');

  searchInput.focus();

  // show clear button when mouse down and input has value
  searchInput.addEventListener('mousedown', () => {
    if (searchInput.value.trim() !== '') {
      clearButton.classList.remove('hidden');
    }
  });

  // show clear button when user inputting
  searchInput.addEventListener('input', () => {
    clearButton.classList.remove('hidden');
  });

  // Hide clear button when input loses focus
  searchInput.addEventListener('blur', (ev) => {
    clearButton.classList.add('hidden');
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    clearButton.classList.add('hidden');

    form.submit();
  });

  // Prevent the input from blurring when the clear button is clicked.
  // This allows the clear button's click event to fire.
  clearButton.addEventListener('mousedown', (ev) => {
    ev.preventDefault();
  });

  // Clear the input field when the clear button is clicked
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    // Re-focus the search input after clearing it for a better UX.
    searchInput.focus();
  });

  document.querySelectorAll('a[href*="tab="]').forEach((tabLink) => {
    tabLink.addEventListener('click', async (ev) => {
      ev.preventDefault();

      try {
        // 1. fetch the full page html
        const url = tabLink.getAttribute('href');

        const res = await fetch(url);

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const html = await res.text();

        // 2. parse into a virtual dom
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 3. extract the new #search-results from the virtual page
        const newResults = doc.querySelector('#search-results');

        // 4. replace old results with the new one
        document.querySelector('#search-results').replaceWith(newResults);

        // update active tab styling
        document.querySelectorAll('a[href*="tab="]').forEach((tl) => {
          const span = tl.querySelector('span');

          span.classList.remove('border-sky-500', 'font-medium');
          span.classList.add('border-transparent');
        });

        const span = tabLink.querySelector('span');

        span.classList.remove('border-transparent');
        span.classList.add('border-sky-500', 'font-medium');

        // update url without reloading
      } catch (error) {
        console.error('💥 Error:', error);
      }
    });
  });

  // handle message deletion
  handleMessageDeletionDropdown();
});
