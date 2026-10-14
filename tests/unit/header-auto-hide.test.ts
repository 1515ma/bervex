import { describe, expect, it } from 'vitest';
import { HIDE_AFTER_PX, decideHeaderVisibility } from '../../src/scripts/header-auto-hide';

describe('decideHeaderVisibility', () => {
  it('mostra no topo da página', () => {
    expect(decideHeaderVisibility(300, HIDE_AFTER_PX - 1, false)).toBe('show');
  });

  it('esconde ao rolar para baixo depois do limite', () => {
    expect(decideHeaderVisibility(400, 480, false)).toBe('hide');
  });

  it('mostra ao rolar para cima', () => {
    expect(decideHeaderVisibility(800, 700, false)).toBe('show');
  });

  it('ignora tremidas pequenas de rolagem', () => {
    expect(decideHeaderVisibility(800, 803, false)).toBe('keep');
  });

  it('nunca esconde com o menu do celular aberto', () => {
    expect(decideHeaderVisibility(400, 900, true)).toBe('show');
  });
});
