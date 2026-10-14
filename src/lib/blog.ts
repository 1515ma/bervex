/** Regras do blog: categorias, tempo de leitura, ordenação e posts relacionados. */

export type BlogCategoryId = 'pisos' | 'fitness' | 'guias';

export interface BlogCategory {
  id: BlogCategoryId;
  name: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'pisos', name: 'Pisos', description: 'Piso vinílico, piso de borracha e grama sintética: como escolher, comparar e comprar certo.' },
  { id: 'fitness', name: 'Fitness', description: 'Anilhas, halteres, dumbbells e kettlebells: diferenças, pesos e como montar sua área de treino.' },
  { id: 'guias', name: 'Guias práticos', description: 'Passo a passo para medir, calcular, instalar e conservar pisos e equipamentos.' },
];

export const BLOG_CATEGORY_BY_ID = Object.fromEntries(BLOG_CATEGORIES.map((c) => [c.id, c])) as Record<BlogCategoryId, BlogCategory>;

const WORDS_PER_MINUTE = 200;

/** Minutos de leitura (mínimo 1), contando só palavras do texto, sem marcação Markdown. */
export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ');
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function formatPostDate(date: Date): string {
  return dateFormat.format(date);
}

export interface PostLike {
  id: string;
  data: { pubDate: Date; category: BlogCategoryId; tags: string[]; featured?: boolean };
}

export function sortPostsByDate<T extends PostLike>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Relacionados: mesma categoria e tags em comum pesam mais; empate vai para o mais recente. */
export function relatedPosts<T extends PostLike>(current: T, posts: T[], limit = 3): T[] {
  const score = (p: T) =>
    (p.data.category === current.data.category ? 2 : 0) + p.data.tags.filter((t) => current.data.tags.includes(t)).length;
  return sortPostsByDate(posts.filter((p) => p.id !== current.id))
    .map((p, index) => ({ p, s: score(p), index }))
    .sort((a, b) => b.s - a.s || a.index - b.index)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function postPath(post: Pick<PostLike, 'id'>): string {
  return `/blog/${post.id}/`;
}

export function blogCategoryPath(id: BlogCategoryId): string {
  return `/blog/categoria/${id}/`;
}
