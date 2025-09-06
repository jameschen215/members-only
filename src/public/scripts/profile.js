document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('#back-btn-on-profile');

  if (backButton) {
    backButton.addEventListener('click', () => {
      console.log('on click');
      window.history.back();
    });
  }
});
