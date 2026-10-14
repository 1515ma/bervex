import { describe, expect, it } from 'vitest';
import { homeCalculatorResult } from '../../src/scripts/home-calculator';

describe('homeCalculatorResult', () => {
  it('indica 20 mm e conta placas para musculação', () => {
    expect(homeCalculatorResult('academia-musculacao', 6, 4)).toEqual({
      plates: 26,
      thicknessMm: 20,
      areaWithMarginM2: 25.2,
      productHref: '/produto/piso-de-borracha-1x1/?espessura=20&qtd=26',
    });
  });

  it('usa 15 mm no cardio e 40 mm no LPO', () => {
    expect(homeCalculatorResult('academia-cardio', 3, 3)?.thicknessMm).toBe(15);
    expect(homeCalculatorResult('academia-lpo', 3, 3)?.thicknessMm).toBe(40);
  });

  it('devolve null para medidas inválidas ou aplicação sem placa de borracha', () => {
    expect(homeCalculatorResult('academia-musculacao', Number.NaN, 4)).toBeNull();
    expect(homeCalculatorResult('academia-musculacao', 0, 4)).toBeNull();
    expect(homeCalculatorResult('vinilico', 5, 4)).toBeNull();
  });
});
