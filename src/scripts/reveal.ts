/** Mostra cada [data-reveal] uma vez quando entra na tela. Nunca deixa conteúdo escondido. */
export function wireReveal(doc: Document, win: Window): void {
  const targets = doc.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in win)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );
  targets.forEach((el) => observer.observe(el));

  // Rede de segurança: se o observer não disparar, mostra o que já está na tela.
  win.addEventListener('load', () => {
    win.setTimeout(() => {
      targets.forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.top < win.innerHeight && box.bottom > 0) el.classList.add('is-in');
      });
    }, 2500);
  });
}
