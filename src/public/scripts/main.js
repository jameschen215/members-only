document.addEventListener('DOMContentLoaded', function () {
  const mainSpinner = document.getElementById('main-spinner');
  const mainContent = document.querySelector('#main-content');

  // Enhanced navigation click handler
  document.addEventListener('click', function (ev) {
    const link = ev.target.closest('ul li a[href^="/"]');
    const backButton = ev.target.closest('[data-back-button]');

    if (link && !backButton) {
      // Show the existing spinner immediately
      mainSpinner.classList.remove('hidden');
      mainSpinner.classList.add('flex');
      mainContent.classList.add('hidden');
    }

    // Handle back button separately
    if (backButton) {
      ev.preventDefault();
      handleBackNavigation();
    }
  });

  function handleBackNavigation() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile: use referrer navigation without spinner
      window.location.href = document.referrer || '/';
    } else {
      // Desktop: show spinner and use history.back()
      mainSpinner.classList.remove('hidden');
      mainSpinner.classList.add('flex');
      mainContent.classList.add('hidden');
      window.history.back();
    }
  }

  // Add page show event for back/forward navigation
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      // Page was loaded from cache (back/forward button)
      pageLoadComplete();
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
