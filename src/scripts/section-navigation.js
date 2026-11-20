const sections = [...document.querySelectorAll('[data-doc-section]')];
const sidebar = document.getElementById('side');
const navigation = sidebar.querySelector('.nav');
const fixedSidebar = matchMedia('(width > 900px)');
const links = new Map(
  [...sidebar.querySelectorAll('[data-section-link]')].map((link) => [link.hash.slice(1), link]),
);
const componentLink = sidebar.querySelector('.nav-parent');
const breadcrumb = document.getElementById('current-section');
const parentCrumbs = document.querySelectorAll('.crumb-parent');
const toc = document.getElementById('page-toc');
const tocList = document.getElementById('toc-links');

function updateContents(section) {
  const headings = section.querySelectorAll('[data-doc-content] :is(h3, h4)[id]');
  const items = [];
  for (const heading of headings) {
    if (heading.id === `${section.id}-title` || heading.closest('[data-toc-ignore]')) continue;
    const item = document.createElement('li');
    item.dataset.level = heading.localName;
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent.trim();
    item.append(link);
    items.push(item);
  }
  tocList.replaceChildren(...items);
  toc.hidden = items.length === 0;
  if (toc.hidden) toc.open = false;
}

let active;
function setActive(section) {
  if (active === section) return;
  sidebar.querySelector('[data-section-link][aria-current]')?.removeAttribute('aria-current');
  active = section;
  const link = links.get(section.id);
  link.setAttribute('aria-current', 'location');
  for (let group = link.closest('details'); group; group = group.parentElement.closest('details')) {
    group.open = true;
  }

  const bounds = link.getBoundingClientRect();
  const scroller = fixedSidebar.matches ? navigation : sidebar;
  const scrollBounds = scroller.getBoundingClientRect();
  if (bounds.bottom > scrollBounds.bottom) scroller.scrollTop += bounds.bottom - scrollBounds.bottom;
  if (bounds.top < scrollBounds.top) scroller.scrollTop -= scrollBounds.top - bounds.top;

  const isTopic = section.hasAttribute('data-topic');
  componentLink.classList.toggle('nav-ancestor', isTopic);
  for (const crumb of parentCrumbs) crumb.hidden = !isTopic;
  breadcrumb.textContent = section.dataset.label;
  updateContents(section);
}

let observer;
function observeSections() {
  // Watch a one-pixel band just below the fragment landing position.
  const viewport = document.documentElement.clientHeight;
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const line = Math.min(Math.ceil(padding) + 2, viewport - 1);
  const update = () => {
    const section = sections.findLast((entry) => entry.getBoundingClientRect().top <= line);
    setActive(section ?? sections[0]);
  };
  observer?.disconnect();
  observer = new IntersectionObserver(update, {
    rootMargin: `-${line}px 0px -${viewport - line - 1}px 0px`,
  });
  for (const section of sections) observer.observe(section);
  update();
}

observeSections();
window.addEventListener('resize', observeSections);

document.querySelector('.shell').addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link?.hash) return;
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (!target) return;

  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'start', behavior: 'auto' });
});
