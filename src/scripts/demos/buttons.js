import { roll, toast } from '../shared.js';

const stateButtons = document.querySelectorAll('#btn-state button');
const demoButtons = document.querySelectorAll('#btn-demo button');
const states = ['is-hover', 'is-active', 'is-disabled'];

for (const stateButton of stateButtons) {
  stateButton.addEventListener('click', () => {
    for (const button of stateButtons) button.setAttribute('aria-pressed', String(button === stateButton));
    for (const button of demoButtons) {
      button.classList.remove(...states);
      if (stateButton.dataset.s) button.classList.add(stateButton.dataset.s);
    }
  });
}

const send = document.getElementById('btn-load');
send.addEventListener('click', () => {
  send.disabled = true;
  const spinner = document.createElement('span');
  spinner.className = 'spin';
  spinner.setAttribute('aria-hidden', 'true');
  send.replaceChildren(spinner, 'Envoi en cours');
  roll(send);
  setTimeout(() => {
    send.disabled = false;
    send.textContent = send.dataset.t;
    roll(send);
    toast('Votre invitation a bien été envoyée.');
  }, 1600);
});
