import { contrastResult } from '../../data/colors.js';

const foreground = document.getElementById('c-fg');
const background = document.getElementById('c-bg');
const preview = document.getElementById('c-prev');
const ratio = document.getElementById('c-ratio');
const verdict = document.getElementById('c-verdict');
const detail = document.getElementById('c-detail');
const combinations = [
  ['#F8664D', '#F7F7F7'], ['#FFFFFF', '#FCB3A6'], ['#E50000', '#F8664D'],
  ['#E50000', '#C6CBD4'], ['#C6CBD4', '#FFFFFF'], ['#C6CBD4', '#F7F7F7'],
];

function update() {
  const result = contrastResult(foreground.value, background.value);
  preview.style.background = background.value;
  preview.style.color = foreground.value;
  preview.style.borderColor = ['#FFFFFF', '#F7F7F7'].includes(background.value) ? 'var(--line)' : background.value;
  ratio.textContent = result.value;
  verdict.className = `verdict ${result.tone}`;
  verdict.querySelector('use').setAttribute('href', `#i-${result.icon}`);
  verdict.lastElementChild.textContent = result.verdict;
  detail.textContent = result.detail;
}

foreground.addEventListener('change', update);
background.addEventListener('change', update);
document.getElementById('c-swap').addEventListener('click', () => {
  [foreground.value, background.value] = [background.value, foreground.value];
  update();
});

let example = 0;
document.getElementById('c-bad').addEventListener('click', () => {
  [foreground.value, background.value] = combinations[example];
  example = (example + 1) % combinations.length;
  update();
});
