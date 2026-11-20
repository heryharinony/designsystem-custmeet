const trigger = document.getElementById('search-btn');
const dialog = document.getElementById('search-dialog');
const query = document.getElementById('search-query');
const status = document.getElementById('search-status');
const results = document.getElementById('search-results');
const pagefindURL = new URL('/pagefind/pagefind.js', location.origin).href;

let searchModule;
let pending;
let requestId = 0;

function getPagefind() {
  searchModule ??= import(/* @vite-ignore */ pagefindURL).then(async (module) => {
    await module.init();
    return module;
  }).catch((error) => {
    searchModule = undefined;
    throw error;
  });
  return searchModule;
}

function excerptNodes(text) {
  const template = document.createElement('template');
  template.innerHTML = text;
  return [...template.content.childNodes].map((node) => {
    if (node.nodeName !== 'MARK') return document.createTextNode(node.textContent ?? '');
    const highlight = document.createElement('mark');
    highlight.textContent = node.textContent;
    return highlight;
  });
}

function resultItem(page, match) {
  const title = page.meta.title || page.url;
  const item = document.createElement('li');
  const link = document.createElement('a');
  const snippet = document.createElement('p');
  const url = new URL(match?.url || page.url, location.origin);
  link.href = url.hash || '#apercu';
  link.textContent = match?.title || title;
  link.addEventListener('click', () => dialog.close());
  snippet.append(...excerptNodes(match?.excerpt ?? page.excerpt ?? ''));
  item.append(link, snippet);
  return item;
}

function normalized(text) {
  return text.toLocaleLowerCase('fr').normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function matchingHeadings(page, queryText) {
  const keyword = normalized(queryText);
  const headings = (page.sub_results ?? []).filter((match) => match.url.includes('#'));
  function relevance(match) {
    const title = normalized(match.title || '');
    const titleScore = title === keyword ? 100 : title.includes(keyword) ? 50 : 0;
    return titleScore + Math.min(10, match.locations?.length ?? 0);
  }
  return headings.sort((a, b) => relevance(b) - relevance(a)).slice(0, 12);
}

async function search(value, id) {
  try {
    const pagefind = await getPagefind();
    const response = await pagefind.search(value);
    const pages = await Promise.all(response.results.slice(0, 12).map((entry) => entry.data()));
    if (id !== requestId) return;
    const items = pages.flatMap((page) => {
      const matches = matchingHeadings(page, value);
      if (normalized(page.meta.title || '') === normalized(value)) return [resultItem(page)];
      return matches.length ? matches.map((match) => resultItem(page, match)) : [resultItem(page)];
    });
    results.replaceChildren(...items);
    status.textContent = items.length ? `${items.length} résultat${items.length > 1 ? 's' : ''}` : 'Aucun résultat.';
  } catch {
    if (id === requestId) status.textContent = 'La recherche est indisponible. Lancez la version compilée du site pour utiliser son index.';
  }
}

trigger.hidden = false;
trigger.addEventListener('click', () => {
  dialog.showModal();
  query.focus();
  getPagefind().catch(() => {});
});
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    dialog.close();
  }
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
query.addEventListener('input', () => {
  const value = query.value.trim();
  const id = ++requestId;
  clearTimeout(pending);
  results.replaceChildren();
  status.textContent = value ? 'Recherche en cours…' : '';
  if (value) pending = setTimeout(() => search(value, id), 150);
});
