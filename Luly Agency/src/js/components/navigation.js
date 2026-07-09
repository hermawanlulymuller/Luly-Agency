export function initNavigation() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenuBar = document.getElementById('nav-menu-bar');

  if (!mobileMenuToggle || !navMenuBar) return;

  mobileMenuToggle.addEventListener('click', () => {
    navMenuBar.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (!icon) return;

    if (navMenuBar.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenuBar.classList.remove('active');
      const icon = mobileMenuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });
}
