import { copy, roll, toast } from '../shared.js';
import css from '../../styles/brand-tokens.css?raw';

document.getElementById('copy-tokens').addEventListener('click', () => copy(css.trimEnd(), 'Tokens CSS'));

const join = document.getElementById('join');
let reset;
join.addEventListener('click', () => {
  clearTimeout(reset);
  join.textContent = 'Connecté';
  roll(join);
  toast('Vous avez rejoint la réunion.');
  reset = setTimeout(() => {
    join.textContent = 'Rejoindre';
    roll(join);
  }, 2500);
});
