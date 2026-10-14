/**
 * Calculadora da página inicial: área + tipo de treino viram quantidade e espessura de placas
 * de borracha 1 × 1 m, com link para o produto já pré-selecionado.
 */
import {
  FloorQuoteInputError,
  calculateFloorQuote,
  parseBrazilianNumber,
  type FloorApplication,
} from '../lib/floor-calculator';

export const GYM_THICKNESS_MM: Partial<Record<FloorApplication, number>> = {
  'academia-cardio': 15,
  'academia-musculacao': 20,
  'academia-lpo': 40,
};

export interface HomeCalculatorResult {
  plates: number;
  thicknessMm: number;
  areaWithMarginM2: number;
  productHref: string;
}

export function homeCalculatorResult(application: FloorApplication, lengthM: number, widthM: number): HomeCalculatorResult | null {
  const thicknessMm = GYM_THICKNESS_MM[application];
  if (!thicknessMm) return null;
  try {
    const quote = calculateFloorQuote({ application, lengthM, widthM });
    const plates = quote.plateCount ?? 0;
    return {
      plates,
      thicknessMm,
      areaWithMarginM2: quote.areaWithMarginM2,
      productHref: `/produto/piso-de-borracha-1x1/?espessura=${thicknessMm}&qtd=${plates}`,
    };
  } catch (error) {
    if (error instanceof FloorQuoteInputError) return null;
    throw error;
  }
}

const m2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function wireHomeCalculator(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('form');
  const plates = root.querySelector<HTMLElement>('[data-calc-plates]');
  const detail = root.querySelector<HTMLElement>('[data-calc-detail]');
  const link = root.querySelector<HTMLAnchorElement>('[data-calc-link]');
  if (!form || !plates || !detail || !link) return;

  const update = () => {
    const data = new FormData(form);
    const result = homeCalculatorResult(
      String(data.get('treino')) as FloorApplication,
      parseBrazilianNumber(String(data.get('comprimento') ?? '')),
      parseBrazilianNumber(String(data.get('largura') ?? '')),
    );
    if (!result) {
      plates.textContent = '0';
      detail.textContent = 'Digite comprimento e largura em metros.';
      link.setAttribute('aria-disabled', 'true');
      link.href = '/produto/piso-de-borracha-1x1/';
      return;
    }
    plates.textContent = String(result.plates);
    detail.textContent = `placas de 1 × 1 m com ${result.thicknessMm} mm · ${m2.format(result.areaWithMarginM2)} m² com 5% de margem`;
    link.removeAttribute('aria-disabled');
    link.href = result.productHref;
  };

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (link.getAttribute('aria-disabled') !== 'true') window.location.href = link.href;
  });
  update();
}
