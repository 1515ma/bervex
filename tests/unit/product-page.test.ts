import { describe, expect, it } from 'vitest';
import { MAX_QUANTITY } from '../../src/lib/cart';
import { clampQuantity, readQuantityValue } from '../../src/scripts/product-page';

describe('clampQuantity', () => {
  it.each([
    [26, 26],
    [2.2, 3],
    [50000, MAX_QUANTITY],
    [0, 0],
    [-4, 0],
    [Number.NaN, 0],
  ])('%s vira %s', (value, expected) => {
    expect(clampQuantity(value)).toBe(expected);
  });
});

describe('readQuantityValue', () => {
  it.each([
    ['1', 1],
    ['9999', 9999],
    ['10000', 0],
    ['2.5', 0],
    ['', 0],
    ['abc', 0],
  ])('"%s" vira %s', (raw, expected) => {
    expect(readQuantityValue(raw)).toBe(expected);
  });
});
