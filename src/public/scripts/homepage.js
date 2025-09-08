document.addEventListener('DOMContentLoaded', () => {
  const dropdownTriggers = document.querySelectorAll(
    '[id^="dropdown-trigger-"]',
  );

  if (dropdownTriggers.length === 0) return;

  document.addEventListener('click', (ev) => {
    if (ev.target.closest('[id^="dropdown-trigger-"]')) {
      const trigger = ev.target.closest('[id^="dropdown-trigger-"]');
      const dropdownMenuId = 'dropdown-menu-' + trigger.id.split('-').at(-1);

      showDropdownById(dropdownMenuId);
    } else if (ev.target.closest('[id^="dropdown-menu-"] form button')) {
      hideAllDropdownMenu();
    } else if (!ev.target.closest('[id^="dropdown-menu-"]')) {
      hideAllDropdownMenu();
    }
  });

  function showDropdownById(id) {
    // Hide all dropdown menus if exist
    hideAllDropdownMenu();

    // Show the current clicked dropdown menu
    document.getElementById(id).classList.remove('hidden');
  }

  function hideDropdownMenuById(id) {
    document.getElementById(id).classList.add('hidden');
  }

  function hideAllDropdownMenu() {
    document.querySelectorAll('[id^="dropdown-menu-"]').forEach((dm) => {
      dm.classList.add('hidden');
    });
  }
});
