// document.addEventListener('DOMContentLoaded', () => {
//   const backButton = document.querySelector('#back-btn-on-users');

//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//   console.log({ isMobile });

//   if (backButton) {
//     backButton.addEventListener('click', () => {
//       if (isMobile) {
//         // Use location-based navigation for mobile
//         window.location.href = document.referrer || '/';
//       } else {
//         // Use history.back() for desktop
//         window.history.back();
//       }
//     });
//   }

//   // if (backButton) {
//   //   backButton.addEventListener('click', () => {
//   //     console.log('on click');
//   //     window.history.back();
//   //   });
//   // }
// });
