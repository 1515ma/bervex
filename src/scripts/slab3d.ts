/**
 * Placa de piso em 3D ([data-slab]): gira levemente com o mouse e troca textura e espessura
 * quando o visitante passa o mouse, foca ou clica num controle [data-slab-set].
 */

export const SLAB_PX_PER_MM = 1.6;
export const SLAB_MIN_PX = 6;

/** Espessura visual em px para uma espessura real em mm (vinílico fica fino, borracha grossa). */
export function slabThicknessPx(mm: number): number {
  if (!Number.isFinite(mm) || mm <= 0) return SLAB_MIN_PX;
  return Math.max(SLAB_MIN_PX, Math.round(mm * SLAB_PX_PER_MM));
}

/** Rotação extra (graus) pela posição normalizada do ponteiro (0..1). */
export function slabRotation(nx: number, ny: number): { rz: number; rx: number } {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  // "+ 0" troca -0 por 0
  return { rz: Math.round((clamp(nx) - 0.5) * 30) + 0, rx: Math.round((clamp(ny) - 0.5) * -14) + 0 };
}

export interface SlabSetting {
  texture?: string;
  thicknessMm?: number;
  label?: string;
  href?: string;
}

export function applySlab(slab: HTMLElement, setting: SlabSetting): void {
  if (setting.texture) slab.style.setProperty('--tex', `url("${setting.texture}")`);
  if (setting.thicknessMm !== undefined) slab.style.setProperty('--h', `${slabThicknessPx(setting.thicknessMm)}px`);
  const label = slab.querySelector<HTMLElement>('[data-slab-label]');
  if (label && setting.label) label.textContent = setting.label;
  const link = slab.querySelector<HTMLAnchorElement>('[data-slab-link]');
  if (link && setting.href) link.href = setting.href;
}

function readSetting(el: HTMLElement): SlabSetting {
  return {
    texture: el.dataset.tex,
    thicknessMm: el.dataset.mm ? Number(el.dataset.mm) : undefined,
    label: el.dataset.label,
    href: el.dataset.href,
  };
}

export function wireSlab(scope: HTMLElement, win: Window): void {
  const slab = scope.querySelector<HTMLElement>('[data-slab]');
  if (!slab) return;

  scope.querySelectorAll<HTMLElement>('[data-slab-set]').forEach((control) => {
    const apply = () => {
      applySlab(slab, readSetting(control));
      scope.querySelectorAll('[data-slab-set]').forEach((c) => c.classList.toggle('is-current', c === control));
    };
    control.addEventListener('focus', apply);
    // Opções de formulário (rádios) mudam só ao escolher; botões e links também reagem ao passar o mouse.
    if (control.tagName === 'INPUT') {
      control.addEventListener('change', apply);
      return;
    }
    control.addEventListener('pointerenter', apply);
    if (control.tagName === 'BUTTON') control.addEventListener('click', apply);
  });

  const fine = win.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;
  const stage = slab.querySelector<HTMLElement>('.slab__stage') ?? slab;
  let frame = 0;
  stage.addEventListener('pointermove', (e) => {
    win.cancelAnimationFrame(frame);
    frame = win.requestAnimationFrame(() => {
      const box = stage.getBoundingClientRect();
      const r = slabRotation((e.clientX - box.left) / box.width, (e.clientY - box.top) / box.height);
      slab.style.setProperty('--rz', `${r.rz}deg`);
      slab.style.setProperty('--rx2', `${r.rx}deg`);
    });
  });
  stage.addEventListener('pointerleave', () => {
    slab.style.removeProperty('--rz');
    slab.style.removeProperty('--rx2');
  });
}
