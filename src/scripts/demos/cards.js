import { toast } from '../shared.js';

const card = document.getElementById('card-link');
card.addEventListener('click', () => toast('Guide de démarrage ouvert.', 'info'));
card.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    card.click();
  }
});
