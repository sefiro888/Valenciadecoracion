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

const revealTargets = [...document.querySelectorAll('.section, .hero-copy')];
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('reveal'); observer.unobserve(entry.target); } }); }, { threshold: .12 });
  revealTargets.forEach(el => observer.observe(el));
}
