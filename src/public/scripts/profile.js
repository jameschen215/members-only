import { handleMessageDeletionDropdown } from './lib/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // const backButton = document.querySelector('#back-btn-on-profile');
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // if (backButton) {
  //   backButton.addEventListener('click', () => {
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

  handleMessageDeletionDropdown();
});
