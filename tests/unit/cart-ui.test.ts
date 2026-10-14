import { describe, expect, it } from 'vitest';
import { MAX_QUANTITY } from '../../src/lib/cart';
import { parseTypedQuantity } from '../../src/scripts/cart-ui';

describe('parseTypedQuantity', () => {
  it.each([
    ['3', 3],
    ['2.6', 3],
    ['99999', MAX_QUANTITY],
  ])('aceita "%s" como %s', (raw, expected) => {
    expect(parseTypedQuantity(raw)).toBe(expected);
  });

  it.each(['', '   ', '0', '-2', 'abc'])('pede para desfazer com "%s"', (raw) => {
    expect(parseTypedQuantity(raw)).toBeNull();
  });
});
