/**
 * Inclinação 3D que segue o mouse em elementos [data-tilt], com reflexo de luz (.tilt-glare).
 * Só com mouse (pointer fine) e sem "reduzir movimento"; no toque o card fica parado.
 */

export interface TiltState {
  rx: number;
  ry: number;
  gx: number;
  gy: number;
}

/** Ângulos a partir da posição do ponteiro dentro do elemento. Centro = 0°, bordas = ±max. */
export function tiltAngles(x: number, y: number, width: number, height: number, max: number): TiltState {
  const nx = width > 0 ? Math.min(1, Math.max(0, x / width)) : 0.5;
  const ny = height > 0 ? Math.min(1, Math.max(0, y / height)) : 0.5;
  const round = (v: number) => Math.round(v * 100) / 100;
  return {
    rx: round((0.5 - ny) * 2 * max),
    ry: round((nx - 0.5) * 2 * max),
    gx: Math.round(nx * 100),
    gy: Math.round(ny * 100),
  };
}

function applyTilt(el: HTMLElement, state: TiltState | null): void {
  if (!state) {
    el.classList.remove('is-tilting');
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
    return;
  }
  el.classList.add('is-tilting');
  el.style.setProperty('--rx', `${state.rx}deg`);
  el.style.setProperty('--ry', `${state.ry}deg`);
  el.style.setProperty('--gx', `${state.gx}%`);
  el.style.setProperty('--gy', `${state.gy}%`);
}

export function wireTilt(root: ParentNode, win: Window): void {
  const fine = win.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;

  root.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 8;
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      win.cancelAnimationFrame(frame);
      frame = win.requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        applyTilt(el, tiltAngles(e.clientX - box.left, e.clientY - box.top, box.width, box.height, max));
      });
    });
    el.addEventListener('pointerleave', () => {
      win.cancelAnimationFrame(frame);
      applyTilt(el, null);
    });
  });
}
