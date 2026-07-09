export function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    let count = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const updateCount = () => {
      count += increment;
      if (count < target) {
        el.textContent = Math.ceil(count) + (el.textContent.includes('%') || target === 99 ? '%' : (target === 24 ? '/7' : '+'));
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target + (target === 99 ? '%' : (target === 24 ? '/7' : '+'));
      }
    };

    updateCount();
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((num) => statsObserver.observe(num));
}
