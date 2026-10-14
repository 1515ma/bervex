/**
 * Calculadora de piso BERVEX: transforma as medidas do ambiente numa indicação de compra
 * (área com margem de corte, quantidade de placas e espessura de referência).
 * Lógica pura, sem DOM e sem I/O, para ser testada isoladamente.
 */

export type FloorApplication =
  | 'academia-cardio'
  | 'academia-musculacao'
  | 'academia-lpo'
  | 'playground'
  | 'vinilico';

export interface FloorQuoteInput {
  application: FloorApplication;
  lengthM: number;
  widthM: number;
  /** Altura de queda livre do brinquedo, em metros. Só usada em playground. */
  fallHeightM?: number;
}

export interface FloorPlate {
  label: string;
  areaM2: number;
}

export interface FloorQuote {
  application: FloorApplication;
  applicationLabel: string;
  areaM2: number;
  marginPercent: number;
  areaWithMarginM2: number;
  plate: FloorPlate | null;
  plateCount: number | null;
  thicknessLabel: string;
  note: string;
}

export class FloorQuoteInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FloorQuoteInputError';
  }
}

export const MAX_SIDE_M = 500;

interface ApplicationRule {
  label: string;
  marginPercent: number;
  plate: FloorPlate | null;
  thickness: (fallHeightM?: number) => string;
  note: string;
}

const GYM_PLATE: FloorPlate = { label: '1,00 × 1,00 m', areaM2: 1 };
const PLAYGROUND_PLATE: FloorPlate = { label: '0,50 × 0,50 m', areaM2: 0.25 };

/** Espessura de referência por altura de queda (ABNT NBR 16071-3 / EN 1177). Ordem crescente. */
export const PLAYGROUND_THICKNESS_BY_FALL_HEIGHT: { maxFallHeightM: number; thickness: string }[] = [
  { maxFallHeightM: 1.0, thickness: 'a partir de 30 mm' },
  { maxFallHeightM: 1.3, thickness: 'a partir de 40 mm' },
  { maxFallHeightM: 1.5, thickness: 'a partir de 50 mm' },
  { maxFallHeightM: 1.8, thickness: 'a partir de 60 mm' },
  { maxFallHeightM: 2.3, thickness: 'a partir de 80 mm' },
];

const ABOVE_TABLE_THICKNESS = 'projeto sob medida (queda acima de 2,3 m)';

export function playgroundThicknessForFallHeight(fallHeightM: number): string {
  const row = PLAYGROUND_THICKNESS_BY_FALL_HEIGHT.find((r) => fallHeightM <= r.maxFallHeightM);
  return row ? row.thickness : ABOVE_TABLE_THICKNESS;
}

const APPLICATION_RULES: Record<FloorApplication, ApplicationRule> = {
  'academia-cardio': {
    label: 'Academia: cardio e funcional',
    marginPercent: 5,
    plate: GYM_PLATE,
    thickness: () => '15 mm',
    note: 'Placas de 15 mm absorvem a vibração de esteiras e bikes e o impacto do treino funcional.',
  },
  'academia-musculacao': {
    label: 'Academia: musculação e peso livre',
    marginPercent: 5,
    plate: GYM_PLATE,
    thickness: () => '20 mm',
    note: 'Com 20 mm o piso aguenta halteres e anilhas apoiados no chão sem marcar o contrapiso.',
  },
  'academia-lpo': {
    label: 'Academia: LPO e cross training',
    marginPercent: 5,
    plate: GYM_PLATE,
    thickness: () => '30 a 40 mm',
    note: 'Para barra caindo de cima da cabeça, indicamos 30 a 40 mm ou plataforma de LPO.',
  },
  playground: {
    label: 'Playground',
    marginPercent: 5,
    plate: PLAYGROUND_PLATE,
    thickness: (fallHeightM) => playgroundThicknessForFallHeight(fallHeightM ?? 1),
    note: 'Referência pela altura de queda. A especificação final segue o laudo de impacto (HIC) da placa.',
  },
  vinilico: {
    label: 'Piso vinílico',
    marginPercent: 10,
    plate: null,
    thickness: () => 'click ou colado, conforme o uso',
    note: 'A margem de 10% cobre recortes em paredes, portas e cantos. Paginação em espinha pede 15%.',
  },
};

export const FLOOR_APPLICATIONS: { value: FloorApplication; label: string }[] = (
  Object.keys(APPLICATION_RULES) as FloorApplication[]
).map((value) => ({ value, label: APPLICATION_RULES[value].label }));

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

function assertValidSide(name: string, value: number): void {
  const isValid = Number.isFinite(value) && value > 0 && value <= MAX_SIDE_M;
  if (!isValid) throw new FloorQuoteInputError(`${name} deve ser um número entre 0 e ${MAX_SIDE_M} m.`);
}

function assertValidFallHeight(value: number | undefined): void {
  if (value === undefined) return;
  const isValid = Number.isFinite(value) && value > 0 && value <= 10;
  if (!isValid) throw new FloorQuoteInputError('A altura de queda deve ser um número entre 0 e 10 m.');
}

function countPlates(areaM2: number, plate: FloorPlate | null): number | null {
  if (!plate) return null;
  // Tolerância evita que 20,000000001 vire 21 placas por erro de ponto flutuante.
  return Math.ceil(areaM2 / plate.areaM2 - 1e-9);
}

export function calculateFloorQuote(input: FloorQuoteInput): FloorQuote {
  assertValidSide('O comprimento', input.lengthM);
  assertValidSide('A largura', input.widthM);
  assertValidFallHeight(input.fallHeightM);

  const rule = APPLICATION_RULES[input.application];
  if (!rule) throw new FloorQuoteInputError('Escolha onde o piso será instalado.');

  const areaM2 = roundTo2(input.lengthM * input.widthM);
  const areaWithMarginM2 = roundTo2(areaM2 * (1 + rule.marginPercent / 100));

  return {
    application: input.application,
    applicationLabel: rule.label,
    areaM2,
    marginPercent: rule.marginPercent,
    areaWithMarginM2,
    plate: rule.plate,
    plateCount: countPlates(areaWithMarginM2, rule.plate),
    thicknessLabel: rule.thickness(input.fallHeightM),
    note: rule.note,
  };
}

/** Converte texto digitado em pt-BR ("4,5", "4.5", " 12 ") em número. Vazio ou inválido vira NaN. */
export function parseBrazilianNumber(raw: string): number {
  const cleaned = raw.trim().replace(/\s/g, '');
  if (!cleaned) return Number.NaN;
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned;
  if (!/^\d+(\.\d+)?$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}
