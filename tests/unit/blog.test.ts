import { describe, expect, it } from 'vitest';
import { formatPostDate, readingMinutes, relatedPosts, sortPostsByDate, type PostLike } from '../../src/lib/blog';

const post = (id: string, date: string, category: PostLike['data']['category'], tags: string[] = []): PostLike => ({
  id,
  data: { pubDate: new Date(date), category, tags },
});

describe('readingMinutes', () => {
  it('conta 200 palavras por minuto, com mínimo de 1', () => {
    expect(readingMinutes('palavra '.repeat(600))).toBe(3);
    expect(readingMinutes('curto')).toBe(1);
  });

  it('ignora marcação de links, imagens e código', () => {
    const md = `## Título\n[texto do link](https://x.com) ![imagem](a.png)\n\`\`\`\n${'codigo '.repeat(400)}\n\`\`\``;
    expect(readingMinutes(md)).toBe(1);
  });
});

describe('formatPostDate', () => {
  it('formata em português sem deslocar o dia', () => {
    expect(formatPostDate(new Date('2026-10-05'))).toBe('5 de outubro de 2026');
  });
});

describe('sortPostsByDate e relatedPosts', () => {
  const a = post('a', '2026-09-01', 'pisos', ['borracha']);
  const b = post('b', '2026-10-01', 'pisos', ['vinilico']);
  const c = post('c', '2026-09-20', 'fitness', ['borracha']);
  const d = post('d', '2026-10-10', 'guias');

  it('ordena do mais novo para o mais antigo', () => {
    expect(sortPostsByDate([a, b, c, d]).map((p) => p.id)).toEqual(['d', 'b', 'c', 'a']);
  });

  it('prioriza mesma categoria e tags em comum, sem o próprio post', () => {
    expect(relatedPosts(a, [a, b, c, d], 3).map((p) => p.id)).toEqual(['b', 'c', 'd']);
  });
});
