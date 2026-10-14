import { describe, expect, it } from 'vitest';
import { matchesSearch, normalizeSearchText } from '../../src/scripts/store-search';

describe('normalizeSearchText', () => {
  it('remove acentos e caixa', () => {
    expect(normalizeSearchText('  Piso VINÍLICO  ')).toBe('piso vinilico');
  });
});

describe('matchesSearch', () => {
  const anilha = 'anilha sport vazada emborrachada anilhas três pegas e revestimento de borracha';

  it.each(['anilha', 'Anilhas', 'emborrachada sport', 'borracha', ''])('encontra "%s"', (q) => {
    expect(matchesSearch(anilha, q)).toBe(true);
  });

  it('exige todas as palavras', () => {
    expect(matchesSearch(anilha, 'anilha cromada')).toBe(false);
  });

  it('acha vinílico sem acento', () => {
    expect(matchesSearch('Piso vinílico Durafloor Inova', 'vinilico inova')).toBe(true);
  });
});
