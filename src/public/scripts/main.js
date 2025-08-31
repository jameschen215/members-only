document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('#dropdown');
  if (!dropdown) return;

  const dropdownTrigger = dropdown.querySelector('#dropdown-trigger');
  const dropdownContent = dropdown.querySelector('#dropdown-content');

  document.addEventListener('click', (ev) => {
    // Toggle logout
    if (ev.target.closest('button') === dropdownTrigger) {
      console.log('clicking on trigger');
      dropdownContent.classList.toggle('hidden');
    } else if (ev.target.closest('div') !== dropdownContent) {
      // Hide dropdown when clicking outside
      dropdownContent.classList.add('hidden');
    }
  });
});
