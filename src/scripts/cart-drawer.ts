/** Abre e fecha a gaveta do carrinho (dialog modal), com saída animada quando permitido. */

const CLOSE_MS = 200;
const pendingClose = new WeakMap<HTMLDialogElement, number>();

export function openCartDrawer(drawer: HTMLDialogElement, win: Window = window): void {
  // Reabrir durante a animação de saída cancela o fechamento agendado.
  const pending = pendingClose.get(drawer);
  if (pending !== undefined) {
    win.clearTimeout(pending);
    pendingClose.delete(drawer);
  }
  drawer.classList.remove('is-closing');
  if (!drawer.open) drawer.showModal();
}

export function closeCartDrawer(drawer: HTMLDialogElement, win: Window = window): void {
  if (!drawer.open || pendingClose.has(drawer)) return;
  const reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    drawer.close();
    return;
  }
  drawer.classList.add('is-closing');
  const id = win.setTimeout(() => {
    pendingClose.delete(drawer);
    drawer.classList.remove('is-closing');
    drawer.close();
  }, CLOSE_MS);
  pendingClose.set(drawer, id);
}

export function wireCartDrawer(doc: Document, drawer: HTMLDialogElement): void {
  doc.querySelectorAll('[data-cart-open]').forEach((button) =>
    button.addEventListener('click', () => openCartDrawer(drawer)),
  );
  drawer.querySelectorAll('[data-cart-close]').forEach((button) =>
    button.addEventListener('click', () => closeCartDrawer(drawer)),
  );
  // clique no fundo escurecido fecha
  drawer.addEventListener('click', (event) => {
    if (event.target === drawer) closeCartDrawer(drawer);
  });
  drawer.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeCartDrawer(drawer);
  });
  doc.addEventListener('bervex:open-cart', () => openCartDrawer(drawer));
}
