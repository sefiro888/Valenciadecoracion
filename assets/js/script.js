const eventLinks = [['cumpleanos.html','Cumpleaños','mi-cumpleanos','🎈'],['bautizos.html','Bautizos','mi-bautizos','🕊️'],['revelacion.html','Revelación','mi-revelacion','✨'],['baby-shower.html','Baby shower','mi-babyshower','🧸'],['graduaciones.html','Graduaciones','mi-graduaciones','🎓'],['decoracion-personalizada.html','Personalizada','mi-personalizada','🎨']];
const serviceLinks = [['arcos-organicos.html','Arcos orgánicos','mi-arcos','🌈'],['columnas-torres.html','Columnas y torres','mi-columnas','🗼'],['photocall-tematico.html','Photocall temático','mi-photocall','📸'],['numeros-nombres.html','Números y nombres','mi-numeros','🔢'],['centros-mesa.html','Centros de mesa','mi-centromesa','💐'],['montaje-domicilio.html','Montaje a domicilio','mi-montaje','🚚']];

function buildNavDropdown(nav, matchRegex, buttonLabel, links) {
  const old = Array.from(nav.children).find(el => el.tagName === 'A' && matchRegex.test(el.textContent.trim()));
  if (!old) return;
  const wrap = document.createElement('div'); wrap.className = 'nav-category';
  const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-expanded','false'); button.innerHTML = `${buttonLabel} <span aria-hidden="true">⌄</span>`;
  const menu = document.createElement('div'); menu.className = 'category-menu';
  links.forEach(([href,label,cls,icon]) => { const a=document.createElement('a'); a.href=href; a.className=cls; a.innerHTML = `<span class="menu-icon">${icon}</span>${label}`; menu.appendChild(a); });
  wrap.append(button, menu); old.replaceWith(wrap);
  button.addEventListener('click', () => { const open=wrap.classList.toggle('open'); button.setAttribute('aria-expanded', String(open)); });
}
document.querySelectorAll('.nav-links').forEach(nav => {
  buildNavDropdown(nav, /^categor[ií]as$/i, 'Eventos', eventLinks);
  buildNavDropdown(nav, /^servicios$/i, 'Servicios', serviceLinks);
});
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links > a').forEach(a => { if (a.getAttribute('href') === currentPage || (currentPage === 'index.html' && a.getAttribute('href') === 'index.html')) a.classList.add('active'); });
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) toggle.addEventListener('click', () => { const open = links.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => links?.classList.remove('open')));

const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.hero-dots button')];
let currentSlide = 0;
function showSlide(index) { if (!slides.length) return; currentSlide = (index + slides.length) % slides.length; slides.forEach((slide,i)=>slide.classList.toggle('active',i===currentSlide)); dots.forEach((dot,i)=>dot.classList.toggle('active',i===currentSlide)); }
document.querySelector('[data-next]')?.addEventListener('click',()=>showSlide(currentSlide+1));
document.querySelector('[data-prev]')?.addEventListener('click',()=>showSlide(currentSlide-1));
dots.forEach(dot=>dot.addEventListener('click',()=>showSlide(Number(dot.dataset.slide))));
const heroBanner = document.querySelector('.hero-banner');
let swipeStartX = null;
heroBanner?.addEventListener('touchstart', event => { swipeStartX = event.changedTouches[0]?.clientX ?? null; }, { passive:true });
heroBanner?.addEventListener('touchend', event => {
  if (swipeStartX === null) return;
  const distance = event.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(distance) > 45) showSlide(currentSlide + (distance < 0 ? 1 : -1));
  swipeStartX = null;
}, { passive:true });
if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(()=>showSlide(currentSlide+1), 5600);

const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal img');
document.querySelectorAll('[data-lightbox]').forEach(item => item.addEventListener('click', () => { modalImg.src = item.dataset.lightbox; modalImg.alt = item.alt || ''; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }));
document.querySelector('.modal-close')?.addEventListener('click', () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); });
modal?.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { modal?.classList.remove('open'); modal?.setAttribute('aria-hidden','true'); } });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canObserve = 'IntersectionObserver' in window && !reduceMotion;

const revealTargets = [...document.querySelectorAll('.section, .hero-copy')];
if (canObserve) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('reveal'); observer.unobserve(entry.target); } }); }, { threshold: .12 });
  revealTargets.forEach(el => observer.observe(el));
}

const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

function animateCount(el) {
  const match = el.textContent.trim().match(/^(\d+)(\D*)$/);
  if (!match) return;
  const target = Number(match[1]), suffix = match[2], start = performance.now(), duration = 1400;
  const tick = now => { const p = Math.min(1, (now - start) / duration); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix; if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}

const staggerSelector = '.category-card, .service-num-card, .trust-item, .stat-card, .gallery figure, .mini-gallery figure, .insta-grid a, .steps .step, .detail-card, .related-link, .faq-list details, .badge-pill';
if (canObserve) {
  const items = [...document.querySelectorAll(staggerSelector)];
  items.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.matches(staggerSelector));
    el.style.transitionDelay = (siblings.indexOf(el) % 6) * 90 + 'ms';
    el.classList.add('js-anim');
  });
  const staggerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      staggerObserver.unobserve(el);
      if (el.classList.contains('stat-card')) { const num = el.querySelector('strong'); if (num) animateCount(num); }
      const delay = parseInt(el.style.transitionDelay, 10) || 0;
      setTimeout(() => { el.classList.remove('js-anim', 'in'); el.style.transitionDelay = ''; }, 850 + delay);
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => staggerObserver.observe(el));
}

const gutterDecor = ['img:decor-piniata-t.png','balloons','img:decor-cakepops-t.png','sparkles','img:decor-babyshoes-t.png','balloons','img:decor-giftbox-t.png','sparkles','img:decor-teddybear-t.png','balloons','img:decor-cupcakes-t.png','sparkles'];
document.querySelectorAll('main > section.section, main > section.insta-band').forEach((section, i) => {
  const kind = gutterDecor[i % gutterDecor.length];
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.className = 'gutter-decor ' + (i % 2 ? 'right' : 'left');
  if (kind.startsWith('img:')) { const img = document.createElement('img'); img.src = 'assets/images/decor/' + kind.slice(4); img.alt = ''; img.loading = 'lazy'; el.appendChild(img); }
  else el.classList.add(kind);
  el.style.top = i % 3 === 0 ? '70px' : (i % 3 === 1 ? '38%' : '55%');
  section.appendChild(el);
});
