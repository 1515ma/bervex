/**
 * Estado do carrinho no navegador. O armazenamento é injetado (localStorage em produção,
 * memória nos testes) e cada mudança dispara o evento CART_EVENT no alvo informado.
 */
import {
  addToCart,
  loadCart,
  removeLine,
  saveCart,
  setLineQuantity,
  type CartLine,
  type CartStorage,
  type NewCartLine,
} from '../lib/cart';

export const CART_EVENT = 'bervex:cart';
export const CART_STORAGE_KEY = 'bervex-carrinho';

export class CartStore {
  private lines: CartLine[];

  constructor(
    private readonly storage: CartStorage,
    private readonly events: EventTarget,
  ) {
    this.lines = loadCart(storage);
  }

  get all(): CartLine[] {
    return this.lines;
  }

  add(line: NewCartLine): void {
    this.commit(addToCart(this.lines, line));
  }

  setQuantity(key: string, quantity: number): void {
    this.commit(setLineQuantity(this.lines, key, quantity));
  }

  remove(key: string): void {
    this.commit(removeLine(this.lines, key));
  }

  clear(): void {
    this.commit([]);
  }

  /** Recarrega do armazenamento (outra aba mudou o carrinho). */
  reload(): void {
    this.lines = loadCart(this.storage);
    this.emit();
  }

  subscribe(listener: (lines: CartLine[]) => void): void {
    this.events.addEventListener(CART_EVENT, () => listener(this.lines));
    listener(this.lines);
  }

  private commit(lines: CartLine[]): void {
    this.lines = lines;
    saveCart(this.storage, lines);
    this.emit();
  }

  private emit(): void {
    this.events.dispatchEvent(new CustomEvent(CART_EVENT));
  }
}

export function createLocalStorageAdapter(win: Window, key = CART_STORAGE_KEY): CartStorage {
  return {
    read: () => win.localStorage.getItem(key),
    write: (value) => win.localStorage.setItem(key, value),
  };
}

let shared: CartStore | null = null;

/** Instância única por página, ligada ao localStorage e sincronizada entre abas. */
export function getBrowserCartStore(win: Window = window): CartStore {
  if (shared) return shared;
  const store = new CartStore(createLocalStorageAdapter(win), win);
  win.addEventListener('storage', (event) => {
    if (event.key === CART_STORAGE_KEY) store.reload();
  });
  shared = store;
  return store;
}
