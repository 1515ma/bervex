import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATEGORIES, PRODUCTS, featuredProducts, productsInCategory } from '../../src/data/catalog';
import { weightRange } from '../../src/data/catalog-options';

const ASSETS = resolve(__dirname, '../../src/assets');

function imageFile(key: string): string {
  const ext = key.startsWith('vinyl/') ? 'jpg' : 'png';
  return resolve(ASSETS, `${key}.${ext}`);
}

describe('catálogo', () => {
  it('tem slugs únicos', () => {
    const slugs = PRODUCTS.map((p) => p.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('tem produtos em todas as categorias', () => {
    for (const category of CATEGORIES) {
      expect(productsInCategory(category.id).length, category.id).toBeGreaterThan(0);
    }
  });

  it('aponta para imagens que existem', () => {
    const keys = [
      ...CATEGORIES.map((c) => c.image),
      ...PRODUCTS.map((p) => p.image),
      ...PRODUCTS.flatMap((p) => p.options.flatMap((o) => o.values.map((v) => v.image).filter(Boolean) as string[])),
    ];
    const missing = keys.filter((k) => !existsSync(imageFile(k)));

    expect(missing).toEqual([]);
  });

  it('não repete valor dentro de uma opção', () => {
    for (const product of PRODUCTS) {
      for (const option of product.options) {
        const values = option.values.map((v) => v.value);
        expect(new Set(values).size, `${product.slug}/${option.id}`).toBe(values.length);
      }
    }
  });

  it('tem 15 linhas de piso vinílico com cores', () => {
    const vinyl = productsInCategory('pisos-vinilicos');

    expect(vinyl).toHaveLength(15);
    expect(vinyl.every((p) => p.options[0].values.length >= 2)).toBe(true);
  });

  it('destaca produtos para a página inicial', () => {
    expect(featuredProducts().length).toBeGreaterThanOrEqual(8);
  });
});

describe('weightRange', () => {
  it('inclui as pontas e respeita passos decimais', () => {
    expect(weightRange(12.5, 20, 2.5)).toEqual([12.5, 15, 17.5, 20]);
    expect(weightRange(4, 10, 2)).toEqual([4, 6, 8, 10]);
  });
});
