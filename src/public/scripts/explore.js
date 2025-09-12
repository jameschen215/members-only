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

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    clearButton.classList.add('hidden');

    const query = searchInput.value.trim();
    loadTab(`/search?q=${query}&tab=messages`);
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

      const url = tabLink.getAttribute('href');
      loadTab(url);
    });
  });

  // handle message deletion
  handleMessageDeletionDropdown();

  async function loadTab(url) {
    const spinner = document.querySelector('#spinner');
    const results = document.querySelector('#search-results');

    try {
      // hide results
      results.classList.add('hidden');

      // show spinner
      spinner.classList.remove('hidden');
      spinner.classList.add('flex');

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
      results.classList.remove('hidden');

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
      window.history.pushState({}, '', url);
    } catch (error) {
      results.innerHTML = `<div class="p-4 text-red-500">Failed to load results.</div>`;
    } finally {
      // hide spinner
      spinner.classList.remove('flex');
      spinner.classList.add('hidden');

      // show results
      results.classList.remove('hidden');
    }
  }
});
