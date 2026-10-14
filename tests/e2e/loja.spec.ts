import { expect, test, type Page } from '@playwright/test';

/** Captura as URLs que o site tenta abrir (WhatsApp) sem sair da página. */
async function captureWindowOpen(page: Page): Promise<() => Promise<string[]>> {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
  return () => page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
}

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

test.describe('página inicial', () => {
  test('carrega sem erros e mostra categorias e destaques', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Do piso ao peso.');
    await expect(page.getByRole('heading', { name: 'Compre por categoria' })).toBeVisible();
    await expect(page.locator('[data-product-card]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('calculadora atualiza placas e o link do produto', async ({ page }) => {
    await page.goto('/#calculadora');
    const calc = page.locator('[data-home-calc]');

    await calc.getByRole('radio', { name: 'LPO e cross' }).check();
    await calc.getByLabel('Comprimento (m)').fill('5');
    await calc.getByLabel('Largura (m)').fill('4');

    await expect(calc.locator('[data-calc-plates]')).toHaveText('21');
    await expect(calc.locator('[data-calc-link]')).toHaveAttribute('href', '/produto/piso-de-borracha-1x1/?espessura=40&qtd=21');
  });

  test('a página se move quando o sistema permite animação', async ({ page }) => {
    await page.goto('/');
    const running = await page.evaluate(() => document.getAnimations().length);

    expect(running).toBeGreaterThan(0);
  });
});

test.describe('banner e ícones', () => {
  test('carrossel troca de destaque pelas abas e setas', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('[data-hero-slider]');

    await hero.getByRole('tab', { name: 'Vinílicos' }).click();
    await expect(hero.getByRole('heading', { name: 'Piso vinílico em 95 cores' })).toBeVisible();
    await expect(hero.getByRole('heading', { name: 'Do piso ao peso.' })).toBeHidden();

    await hero.getByRole('tab', { name: 'Borracha' }).click();
    await expect(hero.getByRole('heading', { name: 'Piso de borracha para academia' })).toBeVisible();
    await expect(hero.getByRole('tab', { name: 'Borracha' })).toHaveAttribute('aria-selected', 'true');
  });

  test('o botão de pausa alterna o estado', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-slide-toggle]');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('aria-label', 'Retomar troca automática');
  });

});

test.describe('compra', () => {
  test('adiciona produto com opções, abre a gaveta e mantém após recarregar', async ({ page }) => {
    await page.goto('/produto/anilha-sport-vazada-emborrachada/');

    await page.locator('label[for="opt-peso-10"]').click();
    await page.locator('label[for="opt-furacao-51"]').click();
    await page.getByLabel('Aumentar quantidade').click();
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();

    const drawer = page.locator('[data-cart-drawer]');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('.cart-line')).toHaveCount(1);
    await expect(drawer.locator('.cart-line__opts')).toHaveText('Peso: 10 kg · Furação: 51 mm (barra olímpica)');
    await expect(drawer.locator('.qty-input')).toHaveValue('2');

    await page.reload();
    await expect(page.locator('[data-cart-count]').first()).toHaveText('1');
  });

  test('envia o pedido pelo WhatsApp com a lista pronta', async ({ page }) => {
    const opened = await captureWindowOpen(page);
    await page.goto('/produto/piso-de-borracha-1x1/?espessura=20&qtd=26');

    await expect(page.locator('#quantidade')).toHaveValue('26');
    await expect(page.locator('[data-selected-label="espessura"]')).toHaveText('20 mm');
    await page.locator('label[for="opt-cor-azul"]').click();
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();

    const drawer = page.locator('[data-cart-drawer]');
    await drawer.getByLabel('Seu nome').fill('Ana');
    await drawer.getByLabel('Cidade ou CEP').fill('Guarulhos/SP');
    await drawer.getByRole('button', { name: 'Enviar pedido pelo WhatsApp' }).click();

    const urls = await opened();
    expect(urls).toHaveLength(1);
    const text = new URL(urls[0]).searchParams.get('text') ?? '';
    expect(text).toContain('Piso de borracha 1 × 1 m (Espessura: 20 mm, Cor: Azul): 26 placas');
    expect(text).toContain('Nome: Ana');
    expect(text).toContain('Cidade/CEP: Guarulhos/SP');
  });

  test('a calculadora de área preenche a quantidade', async ({ page }) => {
    await page.goto('/produto/tatame-eva/');

    await page.locator('label[for="opt-tamanho-1x1"]').click();
    await page.locator('[data-area-input]').fill('10');
    await expect(page.locator('[data-area-output]')).toContainText('11 placas');
    await page.getByRole('button', { name: 'Usar quantidade' }).click();

    await expect(page.locator('#quantidade')).toHaveValue('11');
  });

  test('trocar a cor do vinílico troca a imagem principal', async ({ page }) => {
    await page.goto('/produto/piso-vinilico-durafloor-inova/');
    const main = page.locator('[data-main-image]');
    const before = await main.getAttribute('src');

    await page.locator('label[for="opt-cor-paris"]').click();

    await expect(page.locator('[data-selected-label="cor"]')).toHaveText('Paris');
    await expect(main).not.toHaveAttribute('src', before ?? '');
  });

  test('página do carrinho altera quantidade e remove item', async ({ page }) => {
    await page.goto('/produto/kettlebell-pintado/');
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
    await page.goto('/carrinho/');

    const cart = page.locator('.cart-page');
    await cart.getByRole('button', { name: /Aumentar Kettlebell/ }).click();
    await expect(cart.locator('.qty-input')).toHaveValue('2');
    await cart.getByRole('button', { name: /Remover Kettlebell/ }).click();
    await expect(cart.getByText('Seu carrinho está vazio')).toBeVisible();
  });
});

test.describe('acessibilidade e robustez do carrinho', () => {
  test('editar a quantidade no carrinho mantém o foco e campo vazio não apaga o item', async ({ page }) => {
    await page.goto('/produto/kettlebell-pintado/');
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
    await page.goto('/carrinho/');
    const cart = page.locator('.cart-page');

    const plus = cart.getByRole('button', { name: /Aumentar Kettlebell/ });
    await plus.focus();
    await page.keyboard.press('Enter');
    await expect(cart.locator('.qty-input')).toHaveValue('2');
    await expect(cart.getByRole('button', { name: /Aumentar Kettlebell/ })).toBeFocused();

    const qty = cart.locator('.qty-input');
    await qty.fill('');
    await qty.press('Tab');
    await expect(cart.locator('.cart-line')).toHaveCount(1);
    await expect(cart.locator('.qty-input')).toHaveValue('2');
  });

  test('carrinho salvo corrompido não quebra o botão do carrinho', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('bervex-carrinho', JSON.stringify({ v: 1, lines: [{ key: 'x', slug: 'x', name: 'X', quantity: 1, unitSingular: 'u', unitPlural: 'u', options: [null] }] }));
    });
    await page.goto('/');
    await page.locator('[data-cart-open]').first().click();

    await expect(page.locator('[data-cart-drawer]')).toBeVisible();
    await expect(page.locator('[data-cart-drawer]').getByText('Seu carrinho está vazio')).toBeVisible();
  });

  test('botões do cabeçalho têm nome acessível', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: /Carrinho/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /WhatsApp/ }).first()).toBeVisible();
  });

  test('a foto principal não é trocada ao abrir a página', async ({ page }) => {
    await page.goto('/produto/piso-vinilico-durafloor-city/');
    const main = page.locator('[data-main-image]');

    await expect(main).toHaveAttribute('src', /_mosaico/);
    await expect(main).toHaveAttribute('srcset', /_mosaico/);
  });

  test('quantidade da URL respeita o limite', async ({ page }) => {
    await page.goto('/produto/piso-de-borracha-1x1/?qtd=50000');

    await expect(page.locator('#quantidade')).toHaveValue('9999');
  });
});

test.describe('loja', () => {
  test('busca filtra os produtos', async ({ page }) => {
    await page.goto('/loja/?q=kettlebell');

    await expect(page.locator('[data-search-status]')).toContainText('resultados para “kettlebell”');
    const visible = page.locator('[data-product-card]:visible');
    await expect(visible.first()).toBeVisible();
    for (const name of await visible.locator('h3').allTextContents()) {
      expect(name.toLowerCase()).toMatch(/kettlebell/);
    }
  });

  test('categoria lista só os produtos dela', async ({ page }) => {
    await page.goto('/loja/kettlebells/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kettlebells');
    await expect(page.locator('[data-product-card]')).toHaveCount(2);
  });

  test('guia de instalação tem o passo a passo', async ({ page }) => {
    await page.goto('/como-instalar-piso-vinilico/');

    await expect(page.getByRole('heading', { name: 'Instalando o piso vinílico colado' })).toBeVisible();
  });
});
