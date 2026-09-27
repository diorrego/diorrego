// One HTML document, two message catalogs. English remains the useful fallback.
let messages = {};
let currentLocale = 'en';

export function t(key, values = {}) {
  let value = messages[key] || key;
  for (const [name, replacement] of Object.entries(values)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

export function locale() { return currentLocale; }

export async function initializeLocale() {
  const requested = location.pathname === '/es/' || location.pathname === '/es' ? 'es' : 'en';
  try {
    const response = await fetch(`/locales/${requested}.json`);
    if (!response.ok) throw new Error(`Locale request failed: ${response.status}`);
    const catalog = await response.json();
    if (!catalog['meta.title'] || !catalog['menu.open']) throw new Error('Incomplete message catalog');
    messages = catalog;
    currentLocale = requested;
    document.documentElement.lang = requested;
    document.title = t('meta.title');
    for (const element of document.querySelectorAll('[data-i18n]')) {
      const key = element.dataset.i18n;
      if (messages[key]) element.textContent = messages[key];
    }
    for (const [attribute, selector] of [['aria-label', '[data-i18n-aria-label]'], ['content', '[data-i18n-content]']]) {
      for (const element of document.querySelectorAll(selector)) {
        const key = element.getAttribute(`data-i18n-${attribute}`);
        if (messages[key]) element.setAttribute(attribute, messages[key]);
      }
    }
    for (const link of document.querySelectorAll('[data-language]')) {
      if (link.dataset.language === requested) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  } catch (error) {
    // Core content is already English; a failed catalog never blanks the page.
    const fallback = {
      'menu.open': 'Open menu', 'menu.close': 'Close menu',
      'motion.pause': 'Pause animations', 'motion.resume': 'Resume animations', 'motion.reduced': 'Reduced motion',
      'filter.count': '{count} projects shown.', 'filter.single': '1 project shown.',
      'terminal.help': 'Commands: whoami · ls projects · skills · git log / journey · about · contact. These commands explore the portfolio; they do not run system code.',
      'terminal.unknown': 'Unknown command. Type help to see available commands.',
      'terminal.opened': 'Opened {section}.',
      'terminal.profile': 'Profile', 'terminal.projects': 'Projects', 'terminal.skills': 'Capabilities',
      'terminal.journey': 'Journey', 'terminal.about': 'About', 'terminal.contact': 'Contact',
      'contact.copied': 'Email copied.',
      'contact.copy_unavailable': 'Copy is unavailable. Select the email address above, or use the email link.'
    };
    messages = fallback;
    if (requested === 'es') {
      const notice = document.querySelector('#locale-status');
      notice.textContent = 'The Spanish translation could not load. The English version is still available. Reload to try again.';
      notice.hidden = false;
    }
  }
}
