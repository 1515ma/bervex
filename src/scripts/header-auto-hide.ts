/**
 * Esconde o cabeçalho quando a pessoa rola para baixo (lendo) e mostra de novo ao rolar para cima.
 * Com o menu do celular aberto, o cabeçalho fica sempre visível.
 */
export const HIDE_AFTER_PX = 240;
export const SCROLL_TOLERANCE_PX = 6;

export type HeaderScrollDecision = 'show' | 'hide' | 'keep';

export function decideHeaderVisibility(previousY: number, currentY: number, menuOpen: boolean): HeaderScrollDecision {
  if (menuOpen || currentY < HIDE_AFTER_PX) return 'show';
  const delta = currentY - previousY;
  if (Math.abs(delta) < SCROLL_TOLERANCE_PX) return 'keep';
  return delta > 0 ? 'hide' : 'show';
}

export function wireHeaderAutoHide(doc: Document, win: Window): void {
  const header = doc.querySelector<HTMLElement>('.site-header');
  const menuButton = doc.querySelector<HTMLButtonElement>('.site-header__menu');
  if (!header) return;

  let lastY = win.scrollY;
  let ticking = false;

  const apply = () => {
    const y = win.scrollY;
    const menuOpen = menuButton?.getAttribute('aria-expanded') === 'true';
    const decision = decideHeaderVisibility(lastY, y, menuOpen);
    if (decision !== 'keep') {
      header.classList.toggle('is-hidden', decision === 'hide');
      lastY = y;
    }
    ticking = false;
  };

  win.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      win.requestAnimationFrame(apply);
    },
    { passive: true },
  );
}
