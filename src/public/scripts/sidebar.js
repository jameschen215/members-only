document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggler = document.querySelector('#sidebar-toggler');
  const sidebar = document.querySelector('aside');

  // open
  if (sidebarToggler) {
    sidebarToggler.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
    });
  }

  // close
  document.addEventListener('click', (ev) => {
    // when clicking outside sidebar, close sidebar;
    // and make the toggle button clickable
    if (!sidebar.contains(ev.target) && !sidebarToggler.contains(ev.target)) {
      sidebar.classList.add('-translate-x-full');
    }
  });
});
