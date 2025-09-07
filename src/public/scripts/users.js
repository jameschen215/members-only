document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('#back-btn-on-users');

  if (backButton) {
    backButton.addEventListener('click', () => {
      console.log('on click');
      window.history.back();
    });
  }
});
