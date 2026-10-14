/**
 * Interface do carrinho: contador no cabeçalho, lista de itens (gaveta lateral e página /carrinho/)
 * e envio do pedido pelo WhatsApp. Monta o DOM com textContent, nunca com HTML vindo do armazenamento.
 */
import { MAX_QUANTITY, buildOrderMessage, cartCount, formatQuantity, type CartLine } from '../lib/cart';
import { buildWhatsAppLink } from '../lib/whatsapp-link';
import type { CartStore } from './cart-store';

export interface CheckoutDeps {
  whatsappNumber: string;
  openUrl: (url: string) => void;
}

const ICON_MINUS = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_PLUS = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_TRASH = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function iconButton(className: string, label: string, svg: string): HTMLButtonElement {
  const button = el('button', className);
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.innerHTML = svg; // SVG estático do próprio código
  return button;
}

function renderLineMedia(line: CartLine): HTMLElement {
  const media = el('div', 'cart-line__media');
  if (!line.image) return media;
  const img = el('img', 'cart-line__img');
  img.src = line.image;
  img.alt = '';
  img.width = 72;
  img.height = 72;
  img.loading = 'lazy';
  media.append(img);
  return media;
}

function tagControl<T extends HTMLElement>(node: T, key: string, control: string): T {
  node.dataset.lineKey = key;
  node.dataset.control = control;
  return node;
}

/** Valor digitado válido (inteiro de 1 a MAX_QUANTITY) ou null para desfazer a edição. */
export function parseTypedQuantity(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.min(MAX_QUANTITY, Math.round(value));
}

function renderLineQuantity(line: CartLine, store: CartStore): HTMLElement {
  const wrap = el('div', 'cart-line__qty');
  const minus = tagControl(iconButton('qty-btn', `Diminuir ${line.name}`, ICON_MINUS), line.key, 'minus');
  const plus = tagControl(iconButton('qty-btn', `Aumentar ${line.name}`, ICON_PLUS), line.key, 'plus');
  const input = tagControl(el('input', 'qty-input nums'), line.key, 'qty');
  input.type = 'number';
  input.min = '1';
  input.max = String(MAX_QUANTITY);
  input.step = '1';
  input.inputMode = 'numeric';
  input.value = String(line.quantity);
  input.setAttribute('aria-label', `Quantidade de ${line.name}`);
  minus.addEventListener('click', () => store.setQuantity(line.key, line.quantity - 1));
  plus.addEventListener('click', () => store.setQuantity(line.key, line.quantity + 1));
  input.addEventListener('change', () => {
    const typed = parseTypedQuantity(input.value);
    // Campo vazio ou inválido volta ao valor anterior: remover é só pela lixeira ou pelo "−".
    if (typed === null) input.value = String(line.quantity);
    else store.setQuantity(line.key, typed);
  });
  wrap.append(minus, input, plus, el('span', 'cart-line__unit', formatQuantity(line).replace(/^[\d.,]+\s/, '')));
  return wrap;
}

function renderLineName(line: CartLine): HTMLElement {
  if (!line.url) return el('span', 'cart-line__name', line.name);
  const link = el('a', 'cart-line__name', line.name);
  link.href = line.url;
  return link;
}

function renderLine(line: CartLine, store: CartStore): HTMLLIElement {
  const li = el('li', 'cart-line');
  li.dataset.lineKey = line.key;
  const info = el('div', 'cart-line__info');
  info.append(renderLineName(line));
  if (line.options.length) {
    info.append(el('p', 'cart-line__opts', line.options.map((o) => `${o.label}: ${o.value}`).join(' · ')));
  }
  info.append(renderLineQuantity(line, store));
  const remove = tagControl(iconButton('cart-line__remove', `Remover ${line.name}`, ICON_TRASH), line.key, 'remove');
  remove.addEventListener('click', () => store.remove(line.key));
  li.append(renderLineMedia(line), info, remove);
  return li;
}

interface FocusMemory {
  key: string;
  control: string;
  index: number;
}

function rememberFocus(list: HTMLElement): FocusMemory | null {
  const active = list.ownerDocument.activeElement as HTMLElement | null;
  if (!active || !list.contains(active) || !active.dataset.lineKey) return null;
  const items = [...list.children];
  const index = items.findIndex((li) => li.contains(active));
  return { key: active.dataset.lineKey, control: active.dataset.control ?? '', index };
}

/** Devolve o foco ao mesmo controle; se a linha sumiu, vai para a linha vizinha ou para a lista. */
function restoreFocus(root: HTMLElement, list: HTMLElement, memory: FocusMemory | null): void {
  if (!memory) return;
  const same = [...list.querySelectorAll<HTMLElement>('[data-control]')].find(
    (n) => n.dataset.lineKey === memory.key && n.dataset.control === memory.control,
  );
  if (same) return same.focus();
  const items = [...list.children] as HTMLElement[];
  const neighbor = items[Math.min(memory.index, items.length - 1)];
  const fallback = neighbor?.querySelector<HTMLElement>('[data-control="remove"]') ?? root.querySelector<HTMLElement>('[data-cart-empty] a');
  fallback?.focus();
}

/** Desenha a lista de itens dentro de `root` ([data-cart-list], [data-cart-empty], [data-cart-filled]). */
export function renderCart(root: HTMLElement, lines: CartLine[], store: CartStore): void {
  const list = root.querySelector<HTMLElement>('[data-cart-list]');
  const empty = root.querySelector<HTMLElement>('[data-cart-empty]');
  const filled = root.querySelectorAll<HTMLElement>('[data-cart-filled]');
  const summary = root.querySelector<HTMLElement>('[data-cart-summary]');
  if (!list) return;
  const focus = rememberFocus(list);
  list.replaceChildren(...lines.map((line) => renderLine(line, store)));
  if (empty) empty.hidden = lines.length > 0;
  filled.forEach((node) => (node.hidden = lines.length === 0));
  if (summary) summary.textContent = lines.length === 1 ? '1 item no carrinho' : `${lines.length} itens no carrinho`;
  restoreFocus(root, list, focus);
}

export function wireCartCount(doc: Document, store: CartStore): void {
  const badges = doc.querySelectorAll<HTMLElement>('[data-cart-count]');
  const buttons = doc.querySelectorAll<HTMLElement>('[data-cart-open]');
  store.subscribe((lines) => {
    const count = cartCount(lines);
    badges.forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
    const label = count === 0 ? 'Carrinho vazio' : `Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`;
    buttons.forEach((button) => button.setAttribute('aria-label', label));
  });
}

/** Liga o formulário de fechamento: monta a mensagem e abre o WhatsApp. */
export function wireCheckoutForm(form: HTMLFormElement, store: CartStore, deps: CheckoutDeps): void {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!store.all.length) return;
    const data = new FormData(form);
    const message = buildOrderMessage(store.all, {
      name: String(data.get('nome') ?? ''),
      city: String(data.get('cidade') ?? ''),
    });
    deps.openUrl(buildWhatsAppLink(deps.whatsappNumber, message));
  });
}

export function wireCartRoot(root: HTMLElement, store: CartStore, deps: CheckoutDeps): void {
  store.subscribe((lines) => renderCart(root, lines, store));
  const form = root.querySelector<HTMLFormElement>('[data-cart-checkout]');
  if (form) wireCheckoutForm(form, store, deps);
}
