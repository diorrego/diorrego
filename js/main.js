import { initializeLocale, t, locale } from './i18n.js';
import { initializeTerminal } from './terminal.js';
import { createSpaceBackground } from './space-background.js';
import { initializeBlackHole } from './black-hole.js';

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
document.addEventListener('click', (event) => {
  if (!header.contains(event.target)) setMenu(false);
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

initializeTerminal(t);

const space = createSpaceBackground();
const universe = document.querySelector('#universe');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const blackHole = await initializeBlackHole();
let inView = true;
let frame = 0;
let previous = 0;
let spaceTime = 0;
let artTime = 0;
let resizeTimer;

function render() {
  space.render(spaceTime);
  if (inView) blackHole.render(artTime, !reducedMotion.matches);
}
function canAnimate() {
  return !reducedMotion.matches && !document.hidden;
}
function animate(timestamp) {
  frame = 0;
  if (!canAnimate()) { previous = 0; return; }
  if (!previous || timestamp - previous >= 32) {
    const elapsed = previous ? Math.min((timestamp - previous) / 1000, 0.06) : 0;
    spaceTime += elapsed;
    if (inView) artTime += elapsed;
    previous = timestamp;
    render();
  }
  frame = requestAnimationFrame(animate);
}
function syncMotion() {
  cancelAnimationFrame(frame);
  previous = 0;
  universe.dataset.motion = reducedMotion.matches ? 'reduced' : 'running';
  space.setMotion(universe.dataset.motion);
  if (reducedMotion.matches) spaceTime = artTime = 0;
  render();
  if (canAnimate()) frame = requestAnimationFrame(animate);
}
reducedMotion.addEventListener('change', syncMotion);
document.addEventListener('visibilitychange', syncMotion);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncMotion(); }, { threshold: 0 }).observe(universe);
}
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { space.resize(); syncMotion(); }, 120);
}, { passive: true });
syncMotion();

window.addEventListener('localechange', () => {
  setMenu(false);
  document.querySelector('#terminal-output').textContent = '';
  copyStatus.textContent = '';
  if (filterStatus.textContent) {
    const count = projects.filter(project => !project.hidden).length;
    filterStatus.textContent = t(count === 1 ? 'filter.single' : 'filter.count', {count: new Intl.NumberFormat(locale()).format(count)});
  }
});
