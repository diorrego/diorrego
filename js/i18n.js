// One HTML document, two catalogs, and a clean URL on static project hosting.
let messages = {};
let currentLocale = 'en';

export function t(key, values = {}) {
  let value = messages[key] || key;
  for (const [name, replacement] of Object.entries(values)) value = value.replaceAll(`{${name}}`, String(replacement));
  return value;
}
export function locale() { return currentLocale; }

const fallback = {
  'menu.open': 'Open menu', 'menu.close': 'Close menu',
  'filter.count': '{count} projects shown.', 'filter.single': '1 project shown.',
  'terminal.help': 'Commands: whoami · ls projects · skills · research · git log / journey · about · contact.',
  'terminal.unknown': 'Unknown command. Type help to see available commands.',
  'terminal.opened': 'Opened {section}.',
  'terminal.profile': 'Profile', 'terminal.projects': 'Projects', 'terminal.skills': 'Capabilities',
  'terminal.research': 'Research', 'terminal.journey': 'Journey', 'terminal.about': 'About', 'terminal.contact': 'Contact',
  'contact.copied': 'Email copied.',
  'contact.copy_unavailable': 'Copy is unavailable. Select the email address above, or use the email link.'
};

async function setLocale(requested) {
  try {
    const response = await fetch(new URL(`../locales/${requested}.json`, import.meta.url));
    if (!response.ok) throw new Error(`Locale request failed: ${response.status}`);
    const catalog = await response.json();
    if (!catalog['meta.title'] || !catalog['menu.open']) throw new Error('Incomplete message catalog');
    messages = catalog;
    currentLocale = requested;
    document.documentElement.lang = requested;
    document.title = t('meta.title');
    for (const element of document.querySelectorAll('[data-i18n]')) {
      if (messages[element.dataset.i18n]) element.textContent = messages[element.dataset.i18n];
    }
    for (const attribute of ['aria-label', 'content', 'alt']) {
      for (const element of document.querySelectorAll(`[data-i18n-${attribute}]`)) {
        const key = element.getAttribute(`data-i18n-${attribute}`);
        if (messages[key]) element.setAttribute(attribute, messages[key]);
      }
    }
    for (const button of document.querySelectorAll('[data-language]')) {
      button.setAttribute('aria-pressed', String(button.dataset.language === requested));
    }
    document.querySelector('#locale-status').hidden = true;
    window.dispatchEvent(new Event('localechange'));
  } catch {
    // Failed requests preserve the last readable language; initial HTML is English.
    if (!Object.keys(messages).length) messages = fallback;
    const notice = document.querySelector('#locale-status');
    notice.textContent = 'The translation could not load. The current version is still available. Reload to try again.';
    notice.hidden = false;
  }
}

export async function initializeLocale() {
  // Legacy local language routes remain usable; public switches do not alter the URL.
  await setLocale(/\/es\/?$/.test(location.pathname) ? 'es' : 'en');
  for (const button of document.querySelectorAll('[data-language]')) {
    button.addEventListener('click', () => setLocale(button.dataset.language));
    button.disabled = false;
  }
}
