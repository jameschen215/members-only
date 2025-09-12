document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('button[data-action="go-back"]');

  if (backButton) {
    console.log(backButton);
    backButton.addEventListener('click', () => {
      console.log('clicked');
      window.history.back();
    });
  } else {
    console.log('No back button');
  }
});
