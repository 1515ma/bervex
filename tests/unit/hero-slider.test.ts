import { describe, expect, it } from 'vitest';
import { swipeDirection, wrapIndex } from '../../src/scripts/hero-slider';

describe('wrapIndex', () => {
  it.each([
    [0, 4, 0],
    [4, 4, 0],
    [5, 4, 1],
    [-1, 4, 3],
    [-5, 4, 3],
    [2, 0, 0],
  ])('índice %s em %s slides vira %s', (index, total, expected) => {
    expect(wrapIndex(index, total)).toBe(expected);
  });
});

describe('swipeDirection', () => {
  it('avança ao arrastar para a esquerda e volta para a direita', () => {
    expect(swipeDirection(-80, 5)).toBe(1);
    expect(swipeDirection(80, -5)).toBe(-1);
  });

  it('ignora toques curtos e rolagem vertical', () => {
    expect(swipeDirection(-20, 0)).toBe(0);
    expect(swipeDirection(-60, 120)).toBe(0);
  });
});
