import { toast } from '../shared.js';

const alerts = document.getElementById('alerts');
const initialAlerts = Array.from(alerts.children, (alert) => alert.cloneNode(true));
alerts.addEventListener('click', (event) => event.target.closest('.x')?.closest('.alert').remove());
document.getElementById('alerts-reset').addEventListener('click', () => {
  alerts.replaceChildren(...initialAlerts.map((alert) => alert.cloneNode(true)));
});

const open = document.getElementById('open-modal');
const modal = document.getElementById('modal');
const close = modal.querySelector('[data-close]');
const confirm = modal.querySelector('[data-confirm]');

open.addEventListener('click', () => {
  modal.hidden = false;
  document.body.classList.add('demo-modal-open');
  close.focus();
});

function dismiss() {
  modal.hidden = true;
  document.body.classList.remove('demo-modal-open');
  open.focus();
}

modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target.closest('[data-close]')) dismiss();
  if (event.target.closest('[data-confirm]')) {
    dismiss();
    toast('Vous avez quitté la réunion.', 'info');
  }
});

document.addEventListener('keydown', (event) => {
  if (modal.hidden) return;
  if (event.key === 'Escape') dismiss();
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === close) {
      event.preventDefault();
      confirm.focus();
    } else if (!event.shiftKey && document.activeElement === confirm) {
      event.preventDefault();
      close.focus();
    }
  }
});
