import { describe, expect, it } from 'vitest';
import {
  FLOOR_APPLICATIONS,
  FloorQuoteInputError,
  MAX_SIDE_M,
  calculateFloorQuote,
  parseBrazilianNumber,
  playgroundThicknessForFallHeight,
} from '../../src/lib/floor-calculator';

describe('calculateFloorQuote', () => {
  it('calcula área, margem de 5% e placas de 1 m² para musculação', () => {
    const quote = calculateFloorQuote({ application: 'academia-musculacao', lengthM: 5, widthM: 4 });

    expect(quote.areaM2).toBe(20);
    expect(quote.marginPercent).toBe(5);
    expect(quote.areaWithMarginM2).toBe(21);
    expect(quote.plateCount).toBe(21);
    expect(quote.plate?.label).toBe('1,00 × 1,00 m');
    expect(quote.thicknessLabel).toBe('20 mm');
  });

  it('arredonda a quantidade de placas para cima', () => {
    const quote = calculateFloorQuote({ application: 'academia-cardio', lengthM: 3.3, widthM: 3 });

    expect(quote.areaM2).toBe(9.9);
    expect(quote.areaWithMarginM2).toBe(10.4);
    expect(quote.plateCount).toBe(11);
    expect(quote.thicknessLabel).toBe('15 mm');
  });

  it('não soma uma placa extra por erro de ponto flutuante', () => {
    // 95,24 m² × 1,05 = 100,00200000000001 em ponto flutuante: arredonda para 100 m² e 100 placas
    const quote = calculateFloorQuote({ application: 'academia-lpo', lengthM: 10, widthM: 9.52381 });

    expect(quote.areaWithMarginM2).toBe(100);
    expect(quote.plateCount).toBe(100);
  });

  it('usa placas de 0,50 m e espessura pela altura de queda no playground', () => {
    const quote = calculateFloorQuote({ application: 'playground', lengthM: 4, widthM: 3, fallHeightM: 1.5 });

    expect(quote.areaWithMarginM2).toBe(12.6);
    expect(quote.plateCount).toBe(51);
    expect(quote.plate?.areaM2).toBe(0.25);
    expect(quote.thicknessLabel).toBe('a partir de 50 mm');
  });

  it('assume 1 m de queda quando o playground vem sem altura', () => {
    const quote = calculateFloorQuote({ application: 'playground', lengthM: 2, widthM: 2 });

    expect(quote.thicknessLabel).toBe('a partir de 30 mm');
  });

  it('aplica 10% de margem e não conta placas no vinílico', () => {
    const quote = calculateFloorQuote({ application: 'vinilico', lengthM: 6, widthM: 5 });

    expect(quote.areaWithMarginM2).toBe(33);
    expect(quote.plate).toBeNull();
    expect(quote.plateCount).toBeNull();
  });

  it.each([
    [0, 4],
    [-2, 4],
    [Number.NaN, 4],
    [Number.POSITIVE_INFINITY, 4],
    [MAX_SIDE_M + 1, 4],
  ])('recusa comprimento inválido (%s)', (lengthM, widthM) => {
    expect(() => calculateFloorQuote({ application: 'vinilico', lengthM, widthM })).toThrow(FloorQuoteInputError);
  });

  it('recusa altura de queda inválida', () => {
    expect(() =>
      calculateFloorQuote({ application: 'playground', lengthM: 2, widthM: 2, fallHeightM: 0 }),
    ).toThrow(FloorQuoteInputError);
  });

  it('recusa aplicação desconhecida', () => {
    expect(() =>
      // @ts-expect-error aplicação fora da lista
      calculateFloorQuote({ application: 'garagem', lengthM: 2, widthM: 2 }),
    ).toThrow(FloorQuoteInputError);
  });

  it('expõe uma opção de formulário para cada aplicação', () => {
    expect(FLOOR_APPLICATIONS.map((a) => a.value)).toEqual([
      'academia-cardio',
      'academia-musculacao',
      'academia-lpo',
      'playground',
      'vinilico',
    ]);
  });
});

describe('playgroundThicknessForFallHeight', () => {
  it.each([
    [0.6, 'a partir de 30 mm'],
    [1.0, 'a partir de 30 mm'],
    [1.01, 'a partir de 40 mm'],
    [1.8, 'a partir de 60 mm'],
    [2.3, 'a partir de 80 mm'],
  ])('queda de %s m pede %s', (fall, expected) => {
    expect(playgroundThicknessForFallHeight(fall)).toBe(expected);
  });

  it('pede projeto sob medida acima de 2,3 m', () => {
    expect(playgroundThicknessForFallHeight(2.5)).toMatch(/sob medida/);
  });
});

describe('parseBrazilianNumber', () => {
  it.each([
    ['4,5', 4.5],
    ['4.5', 4.5],
    [' 12 ', 12],
    ['1.250,75', 1250.75],
  ])('converte "%s" em %s', (raw, expected) => {
    expect(parseBrazilianNumber(raw)).toBe(expected);
  });

  it.each(['', 'abc', '4,5m', '-3', '1,2,3'])('devolve NaN para "%s"', (raw) => {
    expect(parseBrazilianNumber(raw)).toBeNaN();
  });
});
