// Split headings into words so each word can blur in on its own
document.querySelectorAll('.reveal-words').forEach((el) => {
  let i = 0;
  const wrap = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          w.style.transitionDelay = `${i++ * 70}ms`;
          frag.append(w);
        });
        child.replaceWith(frag);
      } else {
        wrap(child);
      }
    });
  };
  wrap(el);
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal, .reveal-words').forEach((el) => io.observe(el));

// Menu
const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
const setMenu = (open) => {
  menu.hidden = !open;
  btn.setAttribute('aria-expanded', open);
  btn.textContent = open ? 'Close' : 'Menu';
  document.body.style.overflow = open ? 'hidden' : '';
};
btn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

// Contact form: no backend, so open the visitor's mail app with the message filled in
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const subject = `${d.get('need')} — ${d.get('name')}`;
  const body = [
    d.get('message'),
    '',
    `${d.get('name')}${d.get('company') ? `, ${d.get('company')}` : ''}`,
    d.get('email'),
  ].join('\n');
  location.href = `mailto:iravorobchuk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
