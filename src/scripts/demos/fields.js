import { toast } from '../shared.js';

const mail = document.getElementById('in-mail');
const code = document.getElementById('in-code');
const form = document.getElementById('form-demo');

function setError(input, invalid) {
  input.closest('.field').classList.toggle('err', invalid);
  input.setAttribute('aria-invalid', String(invalid));
}

function checkEmail(required = false) {
  const value = mail.value.trim();
  const valid = value ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) : !required;
  setError(mail, !valid);
  return valid;
}

function checkCode() {
  const valid = code.value.replace(/[^A-Za-z0-9]/g, '').length === 8;
  setError(code, !valid);
  return valid;
}

mail.addEventListener('input', () => checkEmail());
mail.addEventListener('blur', () => checkEmail());
code.addEventListener('input', checkCode);
checkCode();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const validEmail = checkEmail(true);
  const validCode = checkCode();

  if (!mail.value.trim()) {
    toast('Renseignez votre adresse e-mail.', 'warn');
    mail.focus();
  } else if (validEmail && validCode) {
    toast('Vos informations ont bien été validées.');
  } else {
    toast('Corrigez les champs signalés.', 'err');
  }
});

const microphone = document.getElementById('sw-demo');
microphone.addEventListener('click', () => {
  microphone.setAttribute('aria-checked', String(microphone.getAttribute('aria-checked') !== 'true'));
});
