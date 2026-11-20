const sample = document.getElementById('tt-out');
const input = document.getElementById('tt-in');
const controls = document.querySelectorAll('#tt-lvl, #tt-mk');

function update() {
  const level = Number(document.querySelector('#tt-lvl [aria-pressed="true"]').dataset.l);
  const marker = document.querySelector('#tt-mk [aria-pressed="true"]').dataset.m === '1';
  sample.className = `t-h${level}${marker && level <= 3 ? ' mark' : ''}`;
  sample.textContent = input.value || 'Votre titre';
}

input.addEventListener('input', update);
for (const group of controls) {
  group.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    for (const option of group.querySelectorAll('button')) option.setAttribute('aria-pressed', String(option === button));
    update();
  });
}
