import { makeIcon } from '../shared.js';
import { initialPage, lastPage, pageNumbers } from '../../data/pagination.js';

const pager = document.getElementById('pager');
let currentPage = initialPage;

function changePageButton(direction, position, label) {
  const button = document.createElement('button');
  const arrow = makeIcon('chevron', 's20');
  arrow.style.transform = `rotate(${direction === 'prev' ? 90 : -90}deg)`;
  button.type = 'button';
  button.dataset.page = String(position);
  button.dataset.step = direction;
  button.disabled = position < 1 || position > lastPage;
  button.setAttribute('aria-label', label);
  button.append(arrow);
  return button;
}

function numberButton(page) {
  const item = document.createElement(page === '…' ? 'span' : 'button');
  item.textContent = String(page);
  if (page === '…') {
    item.className = 'pager-gap';
  } else {
    item.type = 'button';
    item.dataset.page = String(page);
    if (page === currentPage) item.setAttribute('aria-current', 'page');
  }
  return item;
}

pager.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-page]');
  if (!button) return;
  currentPage = Number(button.dataset.page);
  pager.replaceChildren(
    changePageButton('prev', currentPage - 1, 'Page précédente'),
    ...pageNumbers(currentPage).map(numberButton),
    changePageButton('next', currentPage + 1, 'Page suivante'),
  );
  const successor = button.dataset.step && pager.querySelector(`[data-step="${button.dataset.step}"]:enabled`);
  (successor || pager.querySelector('[aria-current="page"]')).focus();
});

const progress = document.getElementById('prog');
const progressLabel = document.getElementById('prog-t');
let step = 3;
document.getElementById('prog-b').addEventListener('click', () => {
  step = (step % 5) + 1;
  const percent = step * 20;
  progress.firstElementChild.style.width = `${percent}%`;
  progress.setAttribute('aria-valuenow', String(percent));
  progressLabel.textContent = `Étape ${step} sur 5`;
});

const tabList = document.getElementById('tabs');
const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
const indicator = document.createElement('span');
indicator.className = 'ind';
indicator.setAttribute('aria-hidden', 'true');
tabList.prepend(indicator);

let currentTab = 0;
function positionIndicator(instant = false) {
  const tab = tabs[currentTab];
  if (instant) indicator.style.transition = 'none';
  indicator.style.width = `${tab.offsetWidth}px`;
  indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  if (instant) {
    void indicator.offsetWidth;
    indicator.style.transition = '';
  }
}

function selectTab(index) {
  const offset = index >= currentTab ? '18px' : '-18px';
  currentTab = index;
  tabs.forEach((tab, position) => {
    const selected = index === position;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panel.hidden = !selected;
    panel.classList.remove('in');
    if (selected) {
      panel.style.setProperty('--dx', offset);
      void panel.offsetWidth;
      panel.classList.add('in');
    }
  });
  positionIndicator();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', (event) => {
    let next;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % tabs.length; break;
      case 'ArrowLeft': next = (index + tabs.length - 1) % tabs.length; break;
      case 'Home': next = 0; break;
      case 'End': next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectTab(next);
    tabs[next].focus();
  });
});
positionIndicator(true);
window.addEventListener('resize', () => positionIndicator(true));
document.fonts.ready.then(() => positionIndicator(true));

for (const heading of document.querySelectorAll('#acc .acc-h')) {
  heading.addEventListener('click', () => {
    const panel = heading.nextElementSibling;
    panel.hidden = !panel.hidden;
    heading.setAttribute('aria-expanded', String(!panel.hidden));
  });
}
