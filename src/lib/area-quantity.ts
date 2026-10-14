/**
 * Converte a área do ambiente na quantidade a pedir de um produto de piso,
 * somando a margem de corte. Lógica pura, usada no seletor de quantidade da página de produto.
 */
import type { ProductCoverage } from '../data/catalog-types';

export interface AreaQuantity {
  areaM2: number;
  areaWithMarginM2: number;
  quantity: number;
  /** null quando a venda é em m². */
  unitAreaM2: number | null;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function unitAreaFor(coverage: ProductCoverage, selected: Record<string, string>): number | null {
  if (coverage.unitAreaM2) return coverage.unitAreaM2;
  const byOption = coverage.unitAreaByOption;
  if (!byOption) return null;
  return byOption.areas[selected[byOption.optionId]] ?? null;
}

export function quantityForArea(
  areaM2: number,
  coverage: ProductCoverage,
  selected: Record<string, string> = {},
): AreaQuantity | null {
  if (!Number.isFinite(areaM2) || areaM2 <= 0 || areaM2 > 100000) return null;
  const areaWithMarginM2 = round2(areaM2 * (1 + coverage.marginPercent / 100));
  const unitAreaM2 = unitAreaFor(coverage, selected);
  if (coverage.unitAreaByOption && unitAreaM2 === null) return null;
  const quantity = unitAreaM2 ? Math.ceil(areaWithMarginM2 / unitAreaM2 - 1e-9) : Math.ceil(areaWithMarginM2);
  return { areaM2: round2(areaM2), areaWithMarginM2, quantity, unitAreaM2 };
}
