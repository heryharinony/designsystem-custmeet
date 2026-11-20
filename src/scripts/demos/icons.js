import { iconBackgrounds } from '../../data/icon-gallery.js';

const stage = document.getElementById('ic-stage');
const usage = document.getElementById('ic-rule');
const options = document.querySelectorAll('#ic-bg button');

for (const option of options) {
  option.addEventListener('click', () => {
    const key = option.dataset.bg;
    const [background, foreground, active, rule] = iconBackgrounds[key];
    stage.style.setProperty('--ic-bg', background);
    stage.style.setProperty('--ic-fg', foreground);
    stage.style.setProperty('--ic-act', active);
    stage.style.border = key === 'blanc' ? '1px solid var(--line)' : '0';
    usage.textContent = `${rule} Survolez une icône.`;
    for (const item of options) item.setAttribute('aria-pressed', String(item === option));
  });
}
