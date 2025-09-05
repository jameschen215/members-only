document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');

  const threshold = 50;
  let lastScroll = 0;
  let accumulatedScroll = 0;

  // window.addEventListener('scroll', () => {
  //   const currentScroll = window.pageYOffset;
  //   const delta = currentScroll - lastScroll;

  //   accumulatedScroll += delta;

  //   if (accumulatedScroll > threshold) {
  //     // scrolled down enough -> hide
  //     header.classList.add('-translate-y-full');
  //     // header.classList.remove('flex');
  //     // header.classList.add('hidden');
  //   } else if (accumulatedScroll < -threshold) {
  //     // scrolled up enough -> show
  //     header.classList.remove('-translate-y-full');
  //     // header.classList.remove('hidden');
  //     // header.classList.add('flex');

  //     accumulatedScroll = 0; // reset after action
  //   }

  //   lastScroll = currentScroll;
  // });
});
