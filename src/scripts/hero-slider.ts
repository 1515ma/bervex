/**
 * Carrossel do banner principal: troca automática com barra de progresso, setas, bolinhas,
 * teclado e arrasto no celular. Pausa ao passar o mouse, ao focar, com a aba escondida e
 * nunca roda sozinho com "reduzir movimento".
 */

export const AUTOPLAY_MS = 7000;
export const SWIPE_MIN_PX = 40;

export function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

/** Direção do arrasto: -1 volta, 1 avança, 0 ignora (curto demais ou mais vertical que horizontal). */
export function swipeDirection(dx: number, dy: number, minPx = SWIPE_MIN_PX): -1 | 0 | 1 {
  if (Math.abs(dx) < minPx || Math.abs(dx) < Math.abs(dy)) return 0;
  return dx < 0 ? 1 : -1;
}

export interface SliderDeps {
  win: Window;
  autoplay: boolean;
}

export function wireHeroSlider(root: HTMLElement, deps: SliderDeps): void {
  const slides = [...root.querySelectorAll<HTMLElement>('[data-slide]')];
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-slide-tab]')];
  const toggle = root.querySelector<HTMLButtonElement>('[data-slide-toggle]');
  if (slides.length < 2) return;

  const { win } = deps;
  let current = 0;
  let timer = 0;
  let paused = !deps.autoplay;
  let hovering = false;

  const show = (index: number) => {
    current = wrapIndex(index, slides.length);
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === current));
      tab.classList.remove('is-running');
    });
    schedule();
  };

  const running = () => !paused && !hovering && !root.matches(':focus-within') && win.document.visibilityState === 'visible';

  function schedule(): void {
    win.clearTimeout(timer);
    tabs.forEach((tab) => tab.classList.remove('is-running'));
    if (!running()) return;
    const tab = tabs[current];
    if (tab) {
      void tab.offsetWidth;
      tab.classList.add('is-running');
    }
    timer = win.setTimeout(() => show(current + 1), AUTOPLAY_MS);
  }

  const setPaused = (value: boolean) => {
    paused = value;
    root.classList.toggle('is-paused', paused);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Retomar troca automática' : 'Pausar troca automática');
    }
    schedule();
  };

  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i)));
  root.querySelector('[data-slide-prev]')?.addEventListener('click', () => show(current - 1));
  root.querySelector('[data-slide-next]')?.addEventListener('click', () => show(current + 1));
  toggle?.addEventListener('click', () => setPaused(!paused));

  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') {
      hovering = true;
      schedule();
    }
  });
  root.addEventListener('pointerleave', () => {
    hovering = false;
    schedule();
  });
  root.addEventListener('focusin', () => schedule());
  root.addEventListener('focusout', () => win.setTimeout(schedule, 0));
  win.document.addEventListener('visibilitychange', () => schedule());

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  let startX = 0;
  let startY = 0;
  root.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });
  root.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') return;
    const dir = swipeDirection(e.clientX - startX, e.clientY - startY);
    if (dir) show(current + dir);
  });

  root.classList.add('is-ready');
  setPaused(paused);
  show(0);
}
