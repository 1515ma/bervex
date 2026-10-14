/**
 * Carrinho da loja BERVEX: funções puras sobre uma lista de linhas.
 * Quem guarda o carrinho (localStorage, memória) é injetado de fora (ver CartStorage).
 */

export interface CartOptionChoice {
  label: string;
  value: string;
}

export interface CartLine {
  key: string;
  slug: string;
  name: string;
  options: CartOptionChoice[];
  quantity: number;
  unitSingular: string;
  unitPlural: string;
  image?: string;
  url?: string;
}

export type NewCartLine = Omit<CartLine, 'key'>;

export interface CartStorage {
  read(): string | null;
  write(value: string): void;
}

export const MAX_QUANTITY = 9999;
const STORAGE_VERSION = 1;

export function cartLineKey(slug: string, options: CartOptionChoice[]): string {
  return [slug, ...options.map((o) => `${o.label}=${o.value}`)].join('|');
}

/** Quantidade válida: número finito entre 0,01 e o máximo, com até 2 casas. */
export function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) return 0;
  return Math.min(MAX_QUANTITY, Math.round(quantity * 100) / 100);
}

export function addToCart(lines: CartLine[], line: NewCartLine): CartLine[] {
  const quantity = normalizeQuantity(line.quantity);
  if (!quantity) return lines;
  const key = cartLineKey(line.slug, line.options);
  const existing = lines.find((l) => l.key === key);
  const safe = { ...line, image: sameSitePath(line.image), url: sameSitePath(line.url) };
  if (!existing) return [...lines, { ...safe, key, quantity }];
  return lines.map((l) => (l.key === key ? { ...l, quantity: normalizeQuantity(l.quantity + quantity) } : l));
}

export function setLineQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
  const normalized = normalizeQuantity(quantity);
  if (!normalized) return removeLine(lines, key);
  return lines.map((l) => (l.key === key ? { ...l, quantity: normalized } : l));
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => l.key !== key);
}

export function cartCount(lines: CartLine[]): number {
  return lines.length;
}

function isOptionChoice(value: unknown): value is CartOptionChoice {
  if (!value || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return typeof o.label === 'string' && typeof o.value === 'string';
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false;
  const l = value as Record<string, unknown>;
  return (
    typeof l.key === 'string' &&
    typeof l.slug === 'string' &&
    typeof l.name === 'string' &&
    typeof l.quantity === 'number' &&
    typeof l.unitSingular === 'string' &&
    typeof l.unitPlural === 'string' &&
    Array.isArray(l.options) &&
    l.options.every(isOptionChoice)
  );
}

/** Só aceita caminhos do próprio site ("/..."), nunca "javascript:" ou outro domínio. */
export function sameSitePath(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.startsWith('/') && !value.startsWith('//') ? value : undefined;
}

function sanitizeLine(line: CartLine): CartLine {
  return {
    key: cartLineKey(line.slug, line.options),
    slug: line.slug,
    name: line.name,
    options: line.options.map((o) => ({ label: o.label, value: o.value })),
    quantity: normalizeQuantity(line.quantity),
    unitSingular: line.unitSingular,
    unitPlural: line.unitPlural,
    image: sameSitePath(line.image),
    url: sameSitePath(line.url),
  };
}

/** Lê o carrinho salvo; qualquer coisa inválida vira carrinho vazio, nunca erro. */
export function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as { v?: number; lines?: unknown[] };
    if (data.v !== STORAGE_VERSION || !Array.isArray(data.lines)) return [];
    return data.lines
      .filter(isCartLine)
      .map(sanitizeLine)
      .filter((l) => l.quantity > 0);
  } catch {
    return [];
  }
}

export function serializeCart(lines: CartLine[]): string {
  return JSON.stringify({ v: STORAGE_VERSION, lines });
}

export function loadCart(storage: CartStorage): CartLine[] {
  try {
    return parseCart(storage.read());
  } catch {
    return [];
  }
}

export function saveCart(storage: CartStorage, lines: CartLine[]): void {
  try {
    storage.write(serializeCart(lines));
  } catch {
    // Armazenamento bloqueado (aba anônima, cota): o carrinho segue só na memória da página.
  }
}

const qtyFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export function formatQuantity(line: Pick<CartLine, 'quantity' | 'unitSingular' | 'unitPlural'>): string {
  const unit = line.quantity === 1 ? line.unitSingular : line.unitPlural;
  return `${qtyFormat.format(line.quantity)} ${unit}`;
}

export interface OrderCustomer {
  name: string;
  city: string;
}

export function buildOrderMessage(lines: CartLine[], customer: OrderCustomer): string {
  const header = 'Olá, BERVEX! Quero fazer este pedido:';
  const items = lines.map((line, i) => {
    const opts = line.options.map((o) => `${o.label}: ${o.value}`).join(', ');
    return `${i + 1}. ${line.name}${opts ? ` (${opts})` : ''}: ${formatQuantity(line)}`;
  });
  const footer = [
    `Nome: ${customer.name.trim() || '-'}`,
    `Cidade/CEP: ${customer.city.trim() || '-'}`,
    'Pode me passar o valor e o frete?',
  ];
  return [header, '', ...items, '', ...footer].join('\n');
}
