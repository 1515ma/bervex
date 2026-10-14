/** Fábricas de opções reutilizadas pelo catálogo (peso, furação, cores, tamanhos). */
import type { OptionValue, ProductOption, ProductUnit } from './catalog-types';

const kgLabel = (kg: number) => `${String(kg).replace('.', ',')} kg`;

export function weightOption(weights: number[]): ProductOption {
  return {
    id: 'peso',
    label: 'Peso',
    values: weights.map((kg) => ({ value: String(kg), label: kgLabel(kg) })),
  };
}

/** Sequência de pesos com passo fixo, inclusive nas pontas. */
export function weightRange(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let kg = from; kg <= to + 1e-9; kg += step) out.push(Math.round(kg * 10) / 10);
  return out;
}

export const PLATE_WEIGHTS = [1, 2, 3, 4, 5, 10, 15, 20, 25];
export const HALTER_WEIGHTS = weightRange(1, 10, 1);

export const BORE_31: OptionValue = { value: '31', label: '31 mm (barra comum)' };
export const BORE_51: OptionValue = { value: '51', label: '51 mm (barra olímpica)' };

export function boreOption(values: OptionValue[]): ProductOption {
  return { id: 'furacao', label: 'Furação', values };
}

export function thicknessOption(mm: number[]): ProductOption {
  return { id: 'espessura', label: 'Espessura', values: mm.map((v) => ({ value: String(v), label: `${v} mm` })) };
}

const COLOR_HEX: Record<string, string> = {
  preto: '#1b1b1b',
  azul: '#1f4fb4',
  verde: '#1f6b3a',
  vermelho: '#c62828',
  cinza: '#8a8a8a',
  amarelo: '#e8b923',
  laranja: '#e46b1c',
  marrom: '#8b4a1f',
  rosa: '#e04595',
  roxo: '#7b3fbf',
  branco: '#f4f4f2',
};

const COLOR_LABEL: Record<string, string> = {
  preto: 'Preto',
  azul: 'Azul',
  verde: 'Verde',
  vermelho: 'Vermelho',
  cinza: 'Cinza',
  amarelo: 'Amarelo',
  laranja: 'Laranja',
  marrom: 'Marrom',
  rosa: 'Rosa',
  roxo: 'Roxo',
  branco: 'Branco',
};

/** Opção de cor; com `imagePrefix`, cada cor aponta para a foto "<prefixo>--<cor>". */
export function colorOption(colors: string[], imagePrefix?: string): ProductOption {
  return {
    id: 'cor',
    label: 'Cor',
    values: colors.map((c) => ({
      value: c,
      label: COLOR_LABEL[c] ?? c,
      swatch: COLOR_HEX[c],
      ...(imagePrefix ? { image: `${imagePrefix}--${c}` } : {}),
    })),
  };
}

export const RUBBER_COLORS = ['preto', 'azul', 'verde', 'vermelho', 'cinza', 'amarelo', 'laranja'];

export const UNIT: Record<'unidade' | 'par' | 'placa' | 'peca' | 'rolo' | 'm2' | 'kit', ProductUnit> = {
  unidade: { singular: 'unidade', plural: 'unidades' },
  par: { singular: 'unidade', plural: 'unidades', hint: 'Para um par, escolha 2.' },
  placa: { singular: 'placa', plural: 'placas' },
  peca: { singular: 'peça', plural: 'peças' },
  rolo: { singular: 'rolo', plural: 'rolos' },
  m2: { singular: 'm²', plural: 'm²' },
  kit: { singular: 'kit', plural: 'kits' },
};
