import { roll } from '../shared.js';

const tagList = document.getElementById('tags');
const originalTags = Array.from(tagList.querySelectorAll('.tag'), (tag) => tag.cloneNode(true));
const reset = document.getElementById('tags-reset');

tagList.addEventListener('click', (event) => {
  event.target.closest('.tag button')?.closest('.tag').remove();
});
reset.addEventListener('click', () => {
  for (const tag of tagList.querySelectorAll('.tag')) tag.remove();
  reset.before(...originalTags.map((tag) => tag.cloneNode(true)));
  roll(reset);
});

for (const chip of document.querySelectorAll('#chips .chip')) {
  chip.addEventListener('click', () => chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true')));
}
