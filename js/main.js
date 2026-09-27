import { initializeLocale, t, locale } from './i18n.js';

await initializeLocale();

'use strict';

// Every enhancement has a readable, usable HTML fallback.
document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.hidden = false;

function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

const filters = document.querySelector('.project-filters');
const projects = [...document.querySelectorAll('[data-project]')];
const filterStatus = document.querySelector('#filter-status');
filters.hidden = false;
filters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  const category = button.dataset.filter;
  let count = 0;
  for (const project of projects) {
    project.hidden = category !== 'all' && project.dataset.kind !== category;
    if (!project.hidden) count++;
  }
  for (const option of filters.querySelectorAll('button')) {
    option.setAttribute('aria-pressed', String(option === button));
  }
  filterStatus.textContent = t(count === 1 ? 'filter.single' : 'filter.count', { count: new Intl.NumberFormat(locale()).format(count) });
});

// Orbit links always reveal their target, even after filtering the project list.
for (const link of document.querySelectorAll('.orbit-node')) {
  link.addEventListener('click', () => filters.querySelector('[data-filter="all"]').click());
}

const copyButton = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-status');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('diego@woku.app');
    copyStatus.textContent = t('contact.copied');
  } catch {
    copyStatus.textContent = t('contact.copy_unavailable');
  }
});

const universe = document.querySelector('#universe');
const canvas = document.querySelector('#space-canvas');
const context = canvas.getContext('2d', { alpha: false });
const motionButton = document.querySelector('#motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (context) {
  universe.classList.add('has-canvas');
  motionButton.hidden = false;
  const background = document.createElement('canvas');
  const backgroundContext = background.getContext('2d', { alpha: false });
  const palette = ['#ffaf94', '#e88b70', '#c8766a', '#f1c4a8', '#d5b4ba', '#acc7d5'];
  let width = 0, height = 0, centerX = 0, centerY = 0, scale = 1;
  let paused = false, inView = true, frame = 0, time = 0, previous = 0;
  let pointerX = 0, pointerY = 0, offsetX = 0, offsetY = 0;
  let resizeTimer;

  function seededRandom(seed) {
    return () => {
      seed = (Math.imul(1664525, seed) + 1013904223) | 0;
      return (seed >>> 0) / 4294967296;
    };
  }
  const particleRandom = seededRandom(26092026);
  const particles = Array.from({ length: 1100 }, () => ({
    angle: particleRandom() * Math.PI * 2,
    radius: 1 + particleRandom() * 1.24,
    size: particleRandom() > 0.93 ? 2 : 1,
    color: palette[Math.floor(particleRandom() * palette.length)],
    speed: 0.08 + particleRandom() * 0.13,
  }));

  // A low-resolution buffer is intentional: crisp square pixels, bounded fill cost.
  function resize() {
    const bounds = universe.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width / 3));
    height = Math.max(1, Math.round(bounds.height / 3));
    canvas.width = background.width = width;
    canvas.height = background.height = height;
    centerX = width * 0.53;
    centerY = height * 0.46;
    scale = Math.min(width, height) / 185;
    drawBackground();
    render();
  }
  function planet(x, y, radius, colors) {
    for (let py = -radius; py <= radius; py++) {
      for (let px = -radius; px <= radius; px++) {
        const length = (px * px + py * py) / (radius * radius);
        if (length > 1) continue;
        const depth = Math.sqrt(1 - length);
        const light = Math.max(0, (-px / radius * 0.55 - py / radius * 0.4 + depth * 0.7));
        const stripe = Math.sin(py * 0.9 + px * 0.12) > 0.55 ? 0.14 : 0;
        const colorIndex = Math.min(colors.length - 1, Math.floor((light + stripe) * (colors.length - 1)));
        backgroundContext.fillStyle = colors[colorIndex];
        backgroundContext.fillRect(Math.round(x + px), Math.round(y + py), 1, 1);
      }
    }
  }
  function drawBackground() {
    backgroundContext.fillStyle = '#101722';
    backgroundContext.fillRect(0, 0, width, height);
    const random = seededRandom(9001);
    const starCount = Math.min(150, Math.round(width * height / 270));
    for (let i = 0; i < starCount; i++) {
      const x = Math.round(random() * width), y = Math.round(random() * height);
      backgroundContext.fillStyle = i % 9 === 0 ? '#b6bdcc' : '#485465';
      backgroundContext.fillRect(x, y, 1, 1);
      if (i % 23 === 0) {
        backgroundContext.fillStyle = '#a3b4c6';
        backgroundContext.fillRect(x - 1, y, 3, 1);
        backgroundContext.fillRect(x, y - 1, 1, 3);
      }
    }
    planet(width * 0.19, height * 0.75, Math.round(14 * scale), ['#27344a', '#405775', '#6886a0', '#94b3c7', '#cfdae0']);
    planet(width * 0.88, height * 0.19, Math.round(9 * scale), ['#342c42', '#58435a', '#8c697f', '#c397aa']);
    backgroundContext.strokeStyle = '#283747';
    backgroundContext.lineWidth = 0.6;
    backgroundContext.beginPath();
    backgroundContext.ellipse(centerX, centerY, 83 * scale, 72 * scale, -0.35, 0.22, Math.PI * 1.7);
    backgroundContext.stroke();
  }
  function ring(front) {
    for (const particle of particles) {
      const angle = particle.angle + time * particle.speed;
      const depth = Math.sin(angle);
      if ((depth > 0) !== front) continue;
      const radius = 39 * scale * particle.radius;
      const x = Math.cos(angle) * radius;
      const bending = !front ? -12 * scale * Math.exp(-(x * x) / (1200 * scale * scale)) : 0;
      const y = depth * radius * 0.27 + bending;
      const rotation = -0.36;
      const px = centerX + x * Math.cos(rotation) - y * Math.sin(rotation) + offsetX;
      const py = centerY + x * Math.sin(rotation) + y * Math.cos(rotation) + offsetY;
      context.fillStyle = particle.color;
      context.fillRect(Math.round(px), Math.round(py), particle.size, 1);
    }
  }
  function render() {
    context.drawImage(background, 0, 0);
    offsetX += (pointerX - offsetX) * 0.035;
    offsetY += (pointerY - offsetY) * 0.035;
    ring(false);
    const radius = 29 * scale;
    for (let y = -radius - 3; y <= radius + 3; y++) {
      for (let x = -radius - 3; x <= radius + 3; x++) {
        const distance = Math.sqrt(x * x + y * y);
        if (distance > radius + 2) continue;
        if (distance > radius) context.fillStyle = '#805c63';
        else if (distance > radius - 1.3) context.fillStyle = '#e5a68c';
        else if (distance > radius - 2.6) context.fillStyle = '#342834';
        else context.fillStyle = '#0a1018';
        context.fillRect(Math.round(centerX + x + offsetX), Math.round(centerY + y + offsetY), 1, 1);
      }
    }
    ring(true);
  }
  function canAnimate() {
    return !paused && !reducedMotion.matches && inView && !document.hidden;
  }
  function animate(timestamp) {
    frame = 0;
    if (!canAnimate()) { previous = 0; return; }
    // Cap at 30 fps and clamp resumed frame gaps to avoid jumps.
    if (!previous || timestamp - previous >= 32) {
      time += previous ? Math.min((timestamp - previous) / 1000, 0.06) : 0;
      previous = timestamp;
      render();
    }
    frame = requestAnimationFrame(animate);
  }
  function syncMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    const reduced = reducedMotion.matches;
    universe.dataset.motion = reduced ? 'reduced' : paused ? 'paused' : 'running';
    motionButton.disabled = reduced;
    motionButton.setAttribute('aria-pressed', String(paused || reduced));
    motionButton.querySelector('span').textContent = t(reduced ? 'motion.reduced' : paused ? 'motion.resume' : 'motion.pause');
    motionButton.querySelector('path').setAttribute('d', paused ? 'm8 5 11 7-11 7Z' : 'M8 5v14M16 5v14');
    render();
    if (canAnimate()) frame = requestAnimationFrame(animate);
  }
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncMotion(); }, { threshold: 0 }).observe(universe);
  }
  universe.addEventListener('pointermove', (event) => {
    if (!canAnimate() || event.pointerType !== 'mouse') return;
    const rect = universe.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 3;
  }, { passive: true });
  universe.addEventListener('pointerleave', () => { pointerX = pointerY = 0; });
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); syncMotion(); }, 120);
  }, { passive: true });
  resize();
  syncMotion();
}
