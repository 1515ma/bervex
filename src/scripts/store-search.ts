/** Busca da loja: filtra os cards já renderizados pelo termo da URL (?q=). */

/** Remove acentos e caixa para comparar "halter" com "Halteres", "vinilico" com "vinílico". */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Todas as palavras da busca precisam aparecer no texto do produto. */
export function matchesSearch(haystack: string, query: string): boolean {
  const words = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const text = normalizeSearchText(haystack);
  return words.every((w) => text.includes(w.replace(/s$/, '')));
}

export function wireStoreSearch(doc: Document, location: Pick<Location, 'search'>): void {
  const query = new URLSearchParams(location.search).get('q')?.trim() ?? '';
  if (!query) return;
  const cards = [...doc.querySelectorAll<HTMLElement>('[data-product-card]')];
  let visible = 0;
  for (const card of cards) {
    const match = matchesSearch(card.dataset.search ?? '', query);
    card.hidden = !match;
    if (match) visible++;
  }
  const status = doc.querySelector<HTMLElement>('[data-search-status]');
  const text = doc.querySelector<HTMLElement>('[data-search-text]');
  const count = doc.querySelector<HTMLElement>('[data-store-count]');
  const empty = doc.querySelector<HTMLElement>('[data-store-empty]');
  if (text) text.textContent = `${visible} ${visible === 1 ? 'resultado' : 'resultados'} para “${query}”.`;
  if (status) status.hidden = false;
  if (count) count.textContent = `${visible} de ${cards.length} produtos`;
  if (empty) empty.hidden = visible > 0;
}
