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
const waHref = document.querySelector('.nav-ctas .btn-pink')?.getAttribute('href') || 'https://wa.me/34641586364';
if (links) {
  const extra = document.createElement('div');
  extra.className = 'nav-mobile-extra';
  extra.innerHTML = `<p>Decoración con globos en Valencia</p><div class="btns"><a class="btn btn-soft" href="https://www.instagram.com/deco_emma_vlc/" target="_blank" rel="noopener noreferrer">Instagram</a><a class="btn btn-pink" href="${waHref}" target="_blank" rel="noopener noreferrer">Hablemos ↗</a></div>`;
  links.appendChild(extra);
}
const setMenu = open => { links?.classList.toggle('open', open); toggle?.setAttribute('aria-expanded', String(open)); toggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); document.body.classList.toggle('menu-open', open); };
if (toggle && links) {
  toggle.innerHTML = '<span></span><span></span><span></span>';
  toggle.addEventListener('click', e => { e.stopPropagation(); setMenu(!links.classList.contains('open')); });
  document.addEventListener('click', e => { if (links.classList.contains('open') && !links.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));

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

const staggerSelector = '.category-card, .service-num-card, .trust-item, .stat-card, .gallery figure, .mini-gallery figure, .insta-grid a, .steps .step, .detail-card, .related-link, .faq-list details, .badge-pill, .service-pill';
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

const relatedStyle = {
  'cumpleanos.html':['🎈','sp-cumple'], 'bautizos.html':['🕊️','sp-bautizo'], 'revelacion.html':['✨','sp-revela'], 'baby-shower.html':['🧸','sp-baby'], 'graduaciones.html':['🎓','sp-grad'], 'decoracion-personalizada.html':['🎨','sp-perso'],
  'arcos-organicos.html':['🌈','sp-arcos'], 'columnas-torres.html':['🗼','sp-columnas'], 'photocall-tematico.html':['📸','sp-photo'], 'numeros-nombres.html':['🔢','sp-numeros'], 'centros-mesa.html':['💐','sp-mesa'], 'montaje-domicilio.html':['🚚','sp-montaje'],
  'index.html#categorias':['🎉','sp-cumple'], 'index.html#servicios':['🎀','sp-mesa'], 'index.html#inspiracion':['📷','sp-revela']
};
document.querySelectorAll('.related-link').forEach(a => {
  if (a.querySelector('.rl-icon')) return;
  const [icon, cls] = relatedStyle[a.getAttribute('href')] || ['✦','sp-cumple'];
  const sub = a.querySelector('span');
  const title = [...a.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
  const subText = sub ? sub.textContent.replace(/\s*→\s*$/, '') : '';
  a.classList.add(cls);
  a.innerHTML = `<span class="rl-icon" aria-hidden="true">${icon}</span><span class="rl-text">${title}<span>${subText}</span></span><span class="rl-arrow" aria-hidden="true">→</span>`;
});

document.addEventListener('click', e => { document.querySelectorAll('.nav-category.open').forEach(c => { if (!c.contains(e.target)) { c.classList.remove('open'); c.querySelector('button')?.setAttribute('aria-expanded', 'false'); } }); });

const waFloat = document.querySelector('.wa-float');
if (waFloat) {
  waFloat.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg><span>Escríbenos</span>';
  const bubble = document.createElement('div');
  bubble.className = 'wa-bubble';
  bubble.setAttribute('role', 'dialog');
  bubble.setAttribute('aria-label', 'Mensaje de Deco Emma');
  bubble.innerHTML = '<button class="wa-bubble-close" aria-label="Cerrar mensaje">×</button><img src="logo.png" alt=""><div><strong>¿Celebramos juntos? 🎈</strong><span>Cuéntame tu idea y te preparo una propuesta a medida, sin compromiso.</span><em>Escribir por WhatsApp</em></div>';
  document.body.appendChild(bubble);
  let dismissed = false;
  try { dismissed = sessionStorage.getItem('waBubbleClosed') === '1'; } catch (err) {}
  if (!dismissed) setTimeout(() => bubble.classList.add('show'), 3500);
  bubble.addEventListener('click', e => {
    if (e.target.closest('.wa-bubble-close')) {
      bubble.classList.remove('show');
      try { sessionStorage.setItem('waBubbleClosed', '1'); } catch (err) {}
      return;
    }
    window.open(waFloat.href, '_blank', 'noopener');
  });
}

const gutterDecor = ['img:decor-globos-pareja.png','img:decor-piniata-t.png','sparkles','img:decor-luna-t.png','img:decor-cakepops-t.png','balloons','img:decor-osito-crema.png','img:decor-babyshoes-t.png','sparkles','img:decor-biberon-t.png','img:decor-giftbox-t.png','img:decor-globos-ramo.png','img:decor-teddybear-t.png','balloons','img:decor-cupcakes-t.png'];
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
