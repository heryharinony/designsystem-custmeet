const table = document.getElementById('tbl');
const body = table.tBodies[0];
const headings = [...table.tHead.rows[0].cells];
const directions = new Map();
const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const collator = new Intl.Collator('fr', { sensitivity: 'base' });

function value(row, column) {
  const text = row.cells[column].textContent.trim();
  if (column === 1) {
    const [day, month, year] = text.split(' ');
    return Number(year) * 10000 + (months.indexOf(month) + 1) * 100 + Number(day);
  }
  return column === 2 ? Number(text) : text;
}

headings.forEach((heading, column) => {
  const button = heading.querySelector('button');
  button.addEventListener('click', () => {
    const ascending = directions.get(column) !== true;
    directions.set(column, ascending);

    const rows = Array.from(body.rows).sort((first, second) => {
      const a = value(first, column);
      const b = value(second, column);
      const order = typeof a === 'number' ? a - b : collator.compare(a, b);
      return order * (ascending ? 1 : -1);
    });
    body.append(...rows);

    for (const cell of headings) {
      cell.removeAttribute('aria-sort');
      cell.querySelector('.ar')?.remove();
    }
    heading.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
    const indicator = document.createElement('span');
    indicator.className = 'ar';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.textContent = ascending ? '↑' : '↓';
    button.append(indicator);
  });
});
