import { describe, expect, it } from 'vitest';
import { quantityForArea, unitAreaFor } from '../../src/lib/area-quantity';

describe('quantityForArea', () => {
  it('conta placas de 1 m² com 5% de margem', () => {
    const result = quantityForArea(24, { marginPercent: 5, unitAreaM2: 1 });

    expect(result).toEqual({ areaM2: 24, areaWithMarginM2: 25.2, quantity: 26, unitAreaM2: 1 });
  });

  it('conta placas de 0,25 m²', () => {
    expect(quantityForArea(10, { marginPercent: 5, unitAreaM2: 0.25 })?.quantity).toBe(42);
  });

  it('arredonda o m² para cima quando a venda é por m²', () => {
    const result = quantityForArea(30, { marginPercent: 10 });

    expect(result?.areaWithMarginM2).toBe(33);
    expect(result?.quantity).toBe(33);
    expect(result?.unitAreaM2).toBeNull();
  });

  it('usa a área da opção escolhida', () => {
    const coverage = { marginPercent: 5, unitAreaByOption: { optionId: 'tamanho', areas: { '50x50': 0.25, '1x1': 1 } } };

    expect(quantityForArea(4, coverage, { tamanho: '1x1' })?.quantity).toBe(5);
    expect(quantityForArea(4, coverage, { tamanho: '50x50' })?.quantity).toBe(17);
    expect(quantityForArea(4, coverage, {})).toBeNull();
  });

  it.each([0, -1, Number.NaN, 200000])('recusa área inválida (%s)', (area) => {
    expect(quantityForArea(area, { marginPercent: 5, unitAreaM2: 1 })).toBeNull();
  });
});

describe('unitAreaFor', () => {
  it('prefere a área fixa', () => {
    expect(unitAreaFor({ marginPercent: 5, unitAreaM2: 0.25 }, {})).toBe(0.25);
  });
});
