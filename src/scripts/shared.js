const toastStyles = {
  info: ['#80BCE4', 'info'],
  ok: ['#8CD0AC', 'check-circle'],
  warn: ['#FAD880', 'alert'],
  err: ['#F28080', 'x-circle'],
};

export function makeIcon(name, size) {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  const use = document.createElementNS(namespace, 'use');
  svg.setAttribute('class', size ? `ic ${size}` : 'ic');
  svg.setAttribute('aria-hidden', 'true');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

export function toast(message, tone = 'ok') {
  const [color, icon] = toastStyles[tone] ?? toastStyles.ok;
  const notification = document.createElement('div');
  const text = document.createElement('span');
  const timer = document.createElement('i');

  notification.className = 'toast';
  notification.style.setProperty('--c', color);
  text.textContent = message;
  timer.className = 'tbar';
  notification.append(makeIcon(icon), text, timer);
  notification.addEventListener('click', () => notification.remove());
  document.getElementById('toasts').append(notification);
  setTimeout(() => {
    notification.style.transition = 'opacity .3s';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 320);
  }, 4000);
}

export async function copy(value, label = value) {
  try {
    if (!navigator.clipboard) throw new Error();
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement('textarea');
    const focused = document.activeElement;
    field.value = value;
    field.style.cssText = 'position:fixed;opacity:0;';
    document.body.append(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    } finally {
      field.remove();
      focused?.focus();
    }
    if (!copied) {
      toast('Copie impossible. Sélectionnez le texte manuellement.', 'warn');
      return;
    }
  }
  toast(`${label} copié.`);
}

export function roll(button) {
  for (const node of button.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
    const wrapper = document.createElement('span');
    const label = document.createElement('span');
    wrapper.className = 'bl';
    label.className = 'bt';
    label.dataset.t = node.textContent.trim();
    label.textContent = label.dataset.t;
    wrapper.append(label);
    node.replaceWith(wrapper);
  }
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-copy], [data-toast]');
  if (target?.hasAttribute('data-copy')) copy(target.dataset.copy, target.dataset.copyLabel);
  if (target?.hasAttribute('data-toast')) toast(target.dataset.msg, target.dataset.toast);
});
document.querySelectorAll('.btn').forEach(roll);

function positionSegmentIndicators(instant = false) {
  for (const group of document.querySelectorAll('.seg')) {
    let thumb = group.querySelector('.thumb');
    if (!thumb) {
      thumb = document.createElement('span');
      thumb.className = 'thumb';
      thumb.setAttribute('aria-hidden', 'true');
      group.prepend(thumb);
    }
    const selected = group.querySelector('[aria-pressed="true"], [aria-selected="true"]');
    if (!selected) continue;
    if (instant) thumb.style.transition = 'none';
    thumb.style.width = `${selected.offsetWidth}px`;
    thumb.style.transform = `translateX(${selected.offsetLeft}px)`;
    if (instant) {
      void thumb.offsetWidth;
      thumb.style.transition = '';
    }
  }
}

if (document.querySelector('.seg')) {
  positionSegmentIndicators(true);
  document.addEventListener('click', (event) => {
    if (event.target.closest('.seg button')) requestAnimationFrame(() => positionSegmentIndicators());
  });
  window.addEventListener('resize', () => positionSegmentIndicators(true));
  document.fonts.ready.then(() => positionSegmentIndicators(true));
}
