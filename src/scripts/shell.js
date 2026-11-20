const root = document.documentElement;
const themeButton = document.getElementById('theme-btn');
const prefersDark = matchMedia('(prefers-color-scheme: dark)');

function darkTheme() {
  return root.dataset.theme ? root.dataset.theme === 'dark' : prefersDark.matches;
}

function showTheme() {
  const dark = darkTheme();
  themeButton.querySelector('use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
  themeButton.setAttribute('aria-pressed', String(dark));
}

showTheme();
themeButton.addEventListener('click', () => {
  root.dataset.theme = darkTheme() ? 'light' : 'dark';
  try {
    localStorage.setItem('cm-theme', root.dataset.theme);
  } catch {}
  showTheme();
});
prefersDark.addEventListener('change', showTheme);

const menuButton = document.getElementById('menu-btn');
const sidebar = document.getElementById('side');
const closeButton = sidebar.querySelector('.drawer-close');
const backdrop = document.getElementById('drawer-bg');
const shell = document.getElementById('doc-shell');
const narrow = matchMedia('(max-width: 900px)');
const skipLink = document.querySelector('.skip-link');

function setDrawer(open, restore = true) {
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  shell.inert = open;
  skipLink.inert = open;
  if (open) {
    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-modal', 'true');
    closeButton.focus();
  } else {
    sidebar.removeAttribute('role');
    sidebar.removeAttribute('aria-modal');
    if (restore && narrow.matches) menuButton.focus();
  }
}

menuButton.addEventListener('click', () => setDrawer(true));
closeButton.addEventListener('click', () => setDrawer(false));
backdrop.addEventListener('click', () => setDrawer(false));
narrow.addEventListener('change', () => setDrawer(false, false));
sidebar.addEventListener('click', (event) => {
  if (event.target.closest('a') && document.body.classList.contains('menu-open')) setDrawer(false, false);
});
sidebar.addEventListener('keydown', (event) => {
  if (!document.body.classList.contains('menu-open')) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setDrawer(false);
  } else if (event.key === 'Tab') {
    const controls = [...sidebar.querySelectorAll('a, button, summary')].filter((control) => control.getClientRects().length);
    const boundary = event.shiftKey ? controls[0] : controls.at(-1);
    if (document.activeElement === boundary) {
      event.preventDefault();
      (event.shiftKey ? controls.at(-1) : controls[0]).focus();
    }
  }
});

const toc = document.getElementById('page-toc');
toc.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    toc.open = false;
    toc.querySelector('summary').focus({ preventScroll: true });
  }
});
toc.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toc.open) {
    toc.open = false;
    toc.querySelector('summary').focus();
  }
});
document.addEventListener('click', (event) => {
  if (toc.open && !toc.contains(event.target)) toc.open = false;
});
