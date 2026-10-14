/**
 * Página de produto: escolha de opções, troca de imagem, calculadora de área, quantidade,
 * "Adicionar ao carrinho" e "Comprar pelo WhatsApp". Recebe carrinho e abertura de URL por injeção.
 */
import type { ProductCoverage } from '../data/catalog-types';
import { quantityForArea } from '../lib/area-quantity';
import { MAX_QUANTITY, buildOrderMessage, type CartOptionChoice } from '../lib/cart';
import { parseBrazilianNumber } from '../lib/floor-calculator';
import { buildWhatsAppLink } from '../lib/whatsapp-link';
import type { CartStore } from './cart-store';

export interface ProductPageData {
  slug: string;
  name: string;
  url: string;
  thumb: string;
  unit: { singular: string; plural: string };
  coverage?: ProductCoverage;
  options: { id: string; label: string; values: { value: string; label: string; image?: string; srcset?: string; thumb?: string }[] }[];
}

export interface ProductPageDeps {
  store: CartStore;
  whatsappNumber: string;
  openUrl: (url: string) => void;
  openCart: () => void;
  location: Pick<Location, 'search'>;
}

const qtyFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function selectedValues(form: HTMLFormElement, data: ProductPageData): Record<string, string> {
  const fd = new FormData(form);
  return Object.fromEntries(data.options.map((o) => [o.id, String(fd.get(o.id) ?? o.values[0]?.value ?? '')]));
}

function selectedChoices(data: ProductPageData, selected: Record<string, string>): CartOptionChoice[] {
  return data.options.map((o) => {
    const value = o.values.find((v) => v.value === selected[o.id]) ?? o.values[0];
    return { label: o.label, value: value.label };
  });
}

function currentImage(data: ProductPageData, selected: Record<string, string>): { image?: string; srcset?: string; thumb?: string } {
  for (const option of data.options) {
    const value = option.values.find((v) => v.value === selected[option.id]);
    if (value?.image) return value;
  }
  return {};
}

/** Pré-seleciona opções e quantidade vindas da URL (?espessura=20&qtd=26). */
function applyUrlPreset(form: HTMLFormElement, data: ProductPageData, search: string): void {
  const params = new URLSearchParams(search);
  for (const option of data.options) {
    const wanted = params.get(option.id);
    if (!wanted) continue;
    const input = form.querySelector<HTMLInputElement>(`input[name="${option.id}"][value="${CSS.escape(wanted)}"]`);
    if (input) input.checked = true;
  }
  const qty = clampQuantity(Number(params.get('qtd')));
  const qtyInput = form.querySelector<HTMLInputElement>('[name="quantidade"]');
  if (qtyInput && qty) qtyInput.value = String(qty);
}

/** Quantidade inteira entre 1 e MAX_QUANTITY; 0 quando o valor não serve. */
export function clampQuantity(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 0;
  return Math.min(MAX_QUANTITY, Math.ceil(value));
}

/** Lê o campo; só vale inteiro de 1 a MAX_QUANTITY, como o navegador valida. */
export function readQuantityValue(raw: string): number {
  const value = Number(raw);
  return Number.isInteger(value) && value >= 1 && value <= MAX_QUANTITY ? value : 0;
}

function readQuantity(form: HTMLFormElement): number {
  return readQuantityValue(form.querySelector<HTMLInputElement>('[name="quantidade"]')?.value ?? '');
}

function wireQuantityStepper(form: HTMLFormElement): void {
  const input = form.querySelector<HTMLInputElement>('[name="quantidade"]');
  if (!input) return;
  form.querySelector('[data-qty-minus]')?.addEventListener('click', () => {
    input.value = String(Math.max(1, clampQuantity(Number(input.value || 1)) - 1));
  });
  form.querySelector('[data-qty-plus]')?.addEventListener('click', () => {
    input.value = String(Math.min(MAX_QUANTITY, clampQuantity(Number(input.value || 0)) + 1));
  });
}

function updateSelectionLabels(root: HTMLElement, data: ProductPageData, selected: Record<string, string>): void {
  for (const option of data.options) {
    const label = root.querySelector<HTMLElement>(`[data-selected-label="${option.id}"]`);
    const value = option.values.find((v) => v.value === selected[option.id]);
    if (label && value) label.textContent = value.label;
  }
}

function updateMainImage(root: HTMLElement, data: ProductPageData, selected: Record<string, string>): void {
  const img = root.querySelector<HTMLImageElement>('[data-main-image]');
  const chosen = currentImage(data, selected);
  if (!img || !chosen.image || img.dataset.current === chosen.image) return;
  img.dataset.current = chosen.image;
  if (chosen.srcset) img.srcset = chosen.srcset;
  else img.removeAttribute('srcset');
  img.src = chosen.image;
}

function wireAreaCalculator(root: HTMLElement, form: HTMLFormElement, data: ProductPageData): void {
  const coverage = data.coverage;
  const area = root.querySelector<HTMLInputElement>('[data-area-input]');
  const output = root.querySelector<HTMLElement>('[data-area-output]');
  const apply = root.querySelector<HTMLButtonElement>('[data-area-apply]');
  if (!coverage || !area || !output || !apply) return;

  let suggested = 0;
  const update = () => {
    const result = quantityForArea(parseBrazilianNumber(area.value), coverage, selectedValues(form, data));
    suggested = result?.quantity ?? 0;
    apply.disabled = !suggested;
    if (!result) {
      output.textContent = 'Digite a área do ambiente em m².';
      return;
    }
    const unit = suggested === 1 ? data.unit.singular : data.unit.plural;
    output.textContent = `${qtyFormat.format(result.areaWithMarginM2)} m² com ${coverage.marginPercent}% de margem = ${suggested} ${unit}`;
  };

  area.addEventListener('input', update);
  form.addEventListener('change', update);
  apply.addEventListener('click', () => {
    const qty = form.querySelector<HTMLInputElement>('[name="quantidade"]');
    if (qty && suggested) qty.value = String(clampQuantity(suggested));
  });
  update();
}

export function wireProductPage(root: HTMLElement, data: ProductPageData, deps: ProductPageDeps): void {
  const form = root.querySelector<HTMLFormElement>('[data-product-form]');
  if (!form) return;

  applyUrlPreset(form, data, deps.location.search);
  wireQuantityStepper(form);
  wireAreaCalculator(root, form, data);

  const refresh = () => {
    const selected = selectedValues(form, data);
    updateSelectionLabels(root, data, selected);
    updateMainImage(root, data, selected);
  };
  form.addEventListener('change', refresh);
  refresh();

  const buildLine = () => {
    const selected = selectedValues(form, data);
    const image = currentImage(data, selected);
    return {
      slug: data.slug,
      name: data.name,
      url: data.url,
      options: selectedChoices(data, selected),
      quantity: readQuantity(form),
      unitSingular: data.unit.singular,
      unitPlural: data.unit.plural,
      image: image.thumb ?? data.thumb,
    };
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const line = buildLine();
    if (!line.quantity) return;
    deps.store.add(line);
    deps.openCart();
  });

  root.querySelector('[data-buy-now]')?.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const line = buildLine();
    if (!line.quantity) return;
    const message = buildOrderMessage([{ ...line, key: 'agora' }], { name: '', city: '' });
    deps.openUrl(buildWhatsAppLink(deps.whatsappNumber, message));
  });
}
