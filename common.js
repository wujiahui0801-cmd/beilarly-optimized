// ===== BEILARLY SHARED JS =====
// Nav scroll
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });
}
// Cursor glow
const glow = document.getElementById('cursorGlow');
if (glow && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
} else if (glow) {
  glow.style.display = 'none';
}
// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => obs.observe(el));
}
// Counter animation
document.querySelectorAll('[data-count]').forEach(el => {
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(el.dataset.count);
        const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.innerHTML = Math.floor(current).toLocaleString() + suffix;
        }, 25);
        cObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  cObs.observe(el);
});
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
// Mobile nav
const navMobile = document.getElementById('navMobile');
const navLinks = document.querySelector('.nav-links');
if (navMobile && navLinks) {
  navMobile.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    if (open) {
      navLinks.style.display = '';
      navLinks.style.flexDirection = '';
      navLinks.style.position = '';
      navLinks.style.top = '';
      navLinks.style.left = '';
      navLinks.style.width = '';
      navLinks.style.background = '';
      navLinks.style.padding = '';
      navLinks.style.gap = '';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(10,10,10,0.98)';
      navLinks.style.padding = '20px';
      navLinks.style.gap = '16px';
    }
  });
}
// Tab switching
document.querySelectorAll('.tabs').forEach(tabGroup => {
  const tabs = tabGroup.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const parent = tabGroup.parentElement;
      parent.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      const el = parent.querySelector('#' + target);
      if (el) el.style.display = 'block';
    });
  });
});
