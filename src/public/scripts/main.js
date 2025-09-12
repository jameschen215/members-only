document.addEventListener('DOMContentLoaded', function () {
  const mainSpinner = document.getElementById('main-spinner');
  const mainContent = document.querySelector('#main-content');

  // Navigation click handler
  document.addEventListener('click', function (e) {
    const link = e.target.closest('ul li a[href^="/"]');
    if (link && !link.href.includes('#')) {
      // Show the existing spinner immediately
      mainSpinner.classList.remove('hidden');
      mainSpinner.classList.add('flex');
      mainContent.classList.add('hidden');
    }
  });

  // Page load complete
  function pageLoadComplete() {
    // Hide spinner
    mainSpinner?.classList.add('hidden');
    mainSpinner?.classList.remove('flex');

    // Show content
    mainContent?.classList.remove('hidden');

    // Focus first input after everything is visible
    setTimeout(() => {
      focusFirstInput();
    }, 100);
  }

  function focusFirstInput() {
    // Look for first focusable input in main content
    const firstInput = mainContent?.querySelector(
      'input:not([type="hidden"]):not([disabled]), textarea:not([disabled])',
    );

    if (firstInput) {
      // Ensure input is visible and focusable
      const rect = firstInput.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        firstInput.focus();
        console.log('Successfully focused input');
      } else {
        console.log('Input not visible yet, retrying...');
        setTimeout(focusFirstInput, 100);
      }
    }
  }

  // Call pageLoadComplete after a short delay
  // setTimeout(pageLoadComplete, 200);
  pageLoadComplete();
});
