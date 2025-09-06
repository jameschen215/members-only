document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggler = document.querySelector('#sidebar-toggler');
  const sidebar = document.querySelector('aside');

  if (!sidebarToggler || !sidebar) return;
  console.log('sidebar');

  // open sidebar
  sidebarToggler.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
  });

  // close sidebar
  document.addEventListener('click', (ev) => {
    // when clicking outside sidebar, close sidebar;
    // and make the toggle button clickable
    if (!sidebar.contains(ev.target) && !sidebarToggler.contains(ev.target)) {
      sidebar.classList.add('-translate-x-full');
    }
  });
});

/**
 * --- --- --- MENU --- --- ---
 */
document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggler = document.querySelector('#menu-toggler');
  const menu = document.querySelector('#dropdown-menu');

  console.log(dropdownToggler);

  if (dropdownToggler && menu) {
    document.addEventListener('click', (ev) => {
      if (ev.target.closest('button') === dropdownToggler) {
        // Toggle when clicking the toggler
        menu.classList.toggle('hidden');
      } else if (ev.target.closest('#dropdown-menu li')) {
        // Hide when clicking a menu option
        menu.classList.add('hidden');
      } else if (!ev.target.closest('#dropdown-menu')) {
        // Hide when clicking outside
        menu.classList.add('hidden');
      }
    });
  }
});
