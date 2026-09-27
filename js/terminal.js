// These portfolio commands navigate allowlisted content; never execute user input.
export function initializeTerminal(t) {
  const form = document.querySelector('#terminal-form');
  const input = document.querySelector('#terminal-command');
  const output = document.querySelector('#terminal-output');
  const routes = {
    whoami: ['home', 'terminal.profile'],
    projects: ['projects', 'terminal.projects'],
    'ls projects': ['projects', 'terminal.projects'],
    'ls ./projects': ['projects', 'terminal.projects'],
    skills: ['capabilities', 'terminal.skills'],
    'cat skills': ['capabilities', 'terminal.skills'],
    'cat ./skills.md': ['capabilities', 'terminal.skills'],
    journey: ['journey', 'terminal.journey'],
    'git log': ['journey', 'terminal.journey'],
    'git log --oneline': ['journey', 'terminal.journey'],
    about: ['about', 'terminal.about'],
    'cat ./about.md': ['about', 'terminal.about'],
    contact: ['contact', 'terminal.contact'],
    'open ./contact': ['contact', 'terminal.contact'],
  };
  form.closest('.terminal-interaction').hidden = false;
  form.hidden = false;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!command || command === 'help') {
      output.textContent = t('terminal.help');
      return;
    }
    if (!Object.hasOwn(routes, command)) {
      output.textContent = t('terminal.unknown');
      return;
    }
    const [target, label] = routes[command];
    if (target === 'projects') document.querySelector('[data-filter="all"]').click();
    output.textContent = t('terminal.opened', { section: t(label) });
    location.hash = target;
  });
}
