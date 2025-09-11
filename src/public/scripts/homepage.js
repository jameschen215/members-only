import { handleMessageDeletionDropdown } from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#main-header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    // check current scroll position
    const currentScrollY = window.scrollY;

    // scrolling down
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('-translate-y-full', 'opacity-0'); // hide header
    }
    // scrolling up
    else {
      header.classList.remove('-translate-y-full', 'opacity-0'); // show header
    }

    // update the last scroll position
    lastScrollY = currentScrollY;
  });

  // deleting dropdown
  handleMessageDeletionDropdown();
});
