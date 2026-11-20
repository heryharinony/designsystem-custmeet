export const initialPage = 3;
export const lastPage = 8;

export function pageNumbers(current) {
  const pages = [1];
  if (current > 3) pages.push('…');
  for (let page = Math.max(2, current - 1); page <= Math.min(lastPage - 1, current + 1); page += 1) {
    pages.push(page);
  }
  if (current < lastPage - 2) pages.push('…');
  pages.push(lastPage);
  return pages;
}
