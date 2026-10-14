# BERVEX: loja de pisos e equipamentos fitness

Site de vendas da BERVEX: piso vinílico, piso de borracha, grama sintética, tatame, anilhas, halteres,
dumbbells, kettlebells, barras, puxadores, suportes e acessórios. Não há pagamento no site: o cliente
escolhe as opções, monta o carrinho e envia o pedido pronto pelo WhatsApp, onde recebe valor, frete e prazo.

Feito com [Astro](https://astro.build) (site estático, rápido e bom para SEO), TypeScript e CSS puro.

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:4321
npm run build      # gera o site final em dist/
npm run preview    # serve o dist/ para conferir
```

Testes e checagens:

```bash
npm test           # testes unitários (vitest)
npm run test:e2e   # testes de ponta a ponta (Playwright, usa o Chrome instalado)
npm run check      # checagem de tipos do Astro
```

## Antes de publicar (TODO do cliente)

Tudo fica em [`src/config/site.ts`](src/config/site.ts) e [`src/config/site-url.mjs`](src/config/site-url.mjs):

| Item | Onde | Situação |
| --- | --- | --- |
| Número do WhatsApp | `whatsappNumber` e `whatsappDisplay` | **Provisório** (`5500000000000`): sem ele os pedidos não chegam |
| Domínio | `SITE_URL` | Provisório: `https://www.bervex.com.br` |
| E-mail, Instagram, horário | `email`, `instagramUrl`, `openingHours` | Provisórios |
| Razão social e CNPJ | `legalName` | Falta informar |

Depois de trocar o domínio, atualize também `public/robots.txt` e `public/llms.txt`.

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Categorias e produtos (nome, descrição, opções, especificações) | [`src/data/catalog.ts`](src/data/catalog.ts) |
| Cores dos pisos vinílicos | [`src/data/vinyl-collections.json`](src/data/vinyl-collections.json) |
| Fotos dos produtos | `src/assets/products/<slug>.png` (fundo branco, quadradas) |
| Amostras de vinílico | `src/assets/vinyl/<linha>/<cor>.jpg` e `_mosaico.jpg` |
| Fotos de obra | `src/assets/photos/` |
| Logo | `public/brand/` |

Para adicionar um produto: crie a imagem em `src/assets/products/<slug>.png` e acrescente o item na lista
da categoria em `catalog.ts`. O teste `tests/unit/catalog.test.ts` avisa se alguma imagem estiver faltando.

## Estrutura

```
src/
  config/        dados da empresa (WhatsApp, domínio, horários)
  data/          catálogo (categorias, produtos, opções)
  lib/           regras puras e testadas: carrinho, quantidade por área, calculadora, WhatsApp, JSON-LD
  scripts/       comportamento no navegador: carrinho, página de produto, busca, calculadora
  components/    cabeçalho, rodapé, card de produto, carrinho (gaveta e página)
  pages/         início, loja, categorias, produto, carrinho, guia de instalação, sobre, contato
tests/
  unit/          vitest
  e2e/           Playwright
```

O carrinho fica no `localStorage` do navegador do cliente (não há servidor nem banco de dados).

## SEO

- Uma página por produto (117) e por categoria (11), com título, descrição, canonical e breadcrumbs.
- JSON-LD: `Organization`, `WebSite`, `BreadcrumbList`, `OfferCatalog` nas categorias e `Article` no guia.
  Não há marcação `Product` com preço porque a loja não publica preços; ao publicar preços, vale adicionar `Product` + `Offer`.
- `sitemap-index.xml` gerado no build, `robots.txt` liberando buscadores e IAs, e `llms.txt` com o resumo da loja.
- Guia de instalação de piso vinílico como conteúdo de apoio para buscas informacionais.

## Origem do conteúdo

Textos, especificações, cores e fotos de produto vieram dos catálogos de pisos vinílicos e fitness e do
manual de instalação fornecidos pelo cliente. As descrições foram reescritas para o site.
