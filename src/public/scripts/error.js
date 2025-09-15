// document.addEventListener('DOMContentLoaded', () => {
//   const backButton = document.querySelector('button[data-action="go-back"]');
//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
// });
