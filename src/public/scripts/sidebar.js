document.addEventListener('DOMContentLoaded', () => {
  /**
   * Handle sidebar hide and show
   */
  const sidebarToggler = document.querySelector('#sidebar-toggler');
  const sidebar = document.querySelector('aside');

  if (!sidebar) return;

  // open sidebar
  if (sidebarToggler) {
    sidebarToggler.addEventListener('click', openSidebar);
  }

  // close sidebar
  document.addEventListener('click', (ev) => {
    // when clicking outside sidebar, close sidebar;
    // and make the toggle button clickable
    if (
      !sidebar.contains(ev.target) &&
      sidebarToggler &&
      !sidebarToggler.contains(ev.target)
    ) {
      hideSidebar();
    }
    // when clicking on nav link, close sidebar
    else if (ev.target.closest('nav li')) {
      hideSidebar();
    }
  });

  /**
   * Handle dropdown menu hide and show
   */
  const dropdownToggler = document.querySelector('#menu-toggler');
  const menu = document.querySelector('#dropdown-menu');
  const userInfo = document.querySelector('#menu-toggler > div');
  const userAvatar = document.querySelector('#menu-toggler > span');

  if (dropdownToggler && menu) {
    document.addEventListener('click', (ev) => {
      if (ev.target.closest('button') === dropdownToggler) {
        // Toggle when clicking the toggler
        menu.classList.toggle('hidden');

        if (userInfo.classList.contains('opacity-0')) {
          showUserInfo();
        } else if (userInfo.classList.contains('opacity-100')) {
          hideUserInfo();
        }
      } else if (ev.target.closest('#dropdown-menu li')) {
        // Hide when clicking a menu option
        menu.classList.add('hidden');
        hideUserInfo();
        hideSidebar();
      } else if (!ev.target.closest('#dropdown-menu')) {
        // Hide when clicking outside
        menu.classList.add('hidden');
        hideUserInfo();
      }
    });
  }

  /**
   * Helper functions
   */
  function openSidebar() {
    sidebarToggler.setAttribute('aria-expanded', true);
    sidebar.classList.remove(
      '-translate-x-full',
      'opacity-0',
      'sm:opacity-100',
    );
  }

  function hideSidebar() {
    sidebarToggler.setAttribute('aria-expanded', false);
    sidebar.classList.add('-translate-x-full', 'opacity-0', 'sm:opacity-100');
  }

  function showUserInfo() {
    userInfo.classList.remove('opacity-0');
    userInfo.classList.add('opacity-100', 'ml-1');

    userAvatar.classList.remove('lg:ml-2');
    userAvatar.classList.add('ml-0', 'scale-[80%]');
  }

  function hideUserInfo() {
    userInfo.classList.remove('opacity-100', 'ml-1');
    userInfo.classList.add('opacity-0');

    userAvatar.classList.remove('ml-0', 'scale-[80%]');
    userAvatar.classList.add('lg:ml-2');
  }
});
