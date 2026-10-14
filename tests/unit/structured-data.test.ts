import { describe, expect, it } from 'vitest';
import type { BervexSiteConfig } from '../../src/config/site';
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildWebPageSchema,
  toAbsoluteUrl,
} from '../../src/lib/structured-data';

const site: BervexSiteConfig = {
  name: 'BERVEX',
  legalName: 'BERVEX Teste',
  url: 'https://exemplo.com.br',
  locale: 'pt-BR',
  tagline: 'Pisos, revestimentos e fitness',
  description: 'Descrição de teste',
  whatsappNumber: '5511912345678',
  whatsappDisplay: '(11) 91234-5678',
  email: 'contato@exemplo.com.br',
  instagramUrl: 'https://instagram.com/exemplo',
  serviceArea: 'Brasil',
  openingHours: [{ label: 'Seg a sex', days: ['Monday', 'Friday'], opens: '08:00', closes: '18:00' }],
  logoPath: '/brand/logo.png',
  ogImagePath: '/brand/og.jpg',
  cnpj: '',
  address: '',
  privacyEmail: 'privacidade@exemplo.com.br',
};

describe('toAbsoluteUrl', () => {
  it('resolve caminhos relativos no domínio do site', () => {
    expect(toAbsoluteUrl(site, '/pisos-vinilicos/')).toBe('https://exemplo.com.br/pisos-vinilicos/');
  });
});

describe('buildOrganizationSchema', () => {
  it('usa URLs absolutas e telefone com DDI', () => {
    const org = buildOrganizationSchema(site);

    expect(org['@id']).toBe('https://exemplo.com.br/#organizacao');
    expect(org.logo).toEqual({ '@type': 'ImageObject', url: 'https://exemplo.com.br/brand/logo.png' });
    const contact = org.contactPoint as Record<string, unknown>;
    expect(contact.telephone).toBe('+5511912345678');
    expect(contact.hoursAvailable).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['https://schema.org/Monday', 'https://schema.org/Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ]);
  });
});

describe('buildBreadcrumbSchema', () => {
  it('numera os itens a partir de 1', () => {
    const crumbs = buildBreadcrumbSchema(site, [
      { name: 'Início', path: '/' },
      { name: 'Pisos vinílicos', path: '/pisos-vinilicos/' },
    ]);
    const items = crumbs.itemListElement as Record<string, unknown>[];

    expect(items).toHaveLength(2);
    expect(items[1]).toMatchObject({ position: 2, item: 'https://exemplo.com.br/pisos-vinilicos/' });
  });
});

describe('buildWebPageSchema', () => {
  it('liga a página ao site e à organização', () => {
    const page = buildWebPageSchema(site, {
      path: '/sobre/',
      title: 'Sobre',
      description: 'Sobre a BERVEX',
      type: 'AboutPage',
    });

    expect(page['@type']).toBe('AboutPage');
    expect(page.isPartOf).toEqual({ '@id': 'https://exemplo.com.br/#site' });
    expect(page).not.toHaveProperty('primaryImageOfPage');
  });
});

describe('buildItemListSchema', () => {
  it('lista as páginas dos produtos sem marcação de preço ou marca', () => {
    const list = buildItemListSchema(site, 'Pisos', [
      { name: 'Placa 20 mm', description: 'Placa de borracha', category: 'Piso de borracha', url: '/produto/placa/' },
    ]);
    const item = (list.itemListElement as Record<string, unknown>[])[0];

    expect(list).toMatchObject({ '@type': 'ItemList', numberOfItems: 1 });
    expect(item).toEqual({ '@type': 'ListItem', position: 1, name: 'Placa 20 mm', url: 'https://exemplo.com.br/produto/placa/' });
    expect(JSON.stringify(list)).not.toMatch(/price|brand|Product/);
  });
});

describe('buildSchemaGraph', () => {
  it('escapa "<" para não fechar a tag script', () => {
    const json = buildSchemaGraph([{ '@type': 'Thing', name: '</script><b>' }]);

    expect(json).not.toContain('</script>');
    expect(JSON.parse(json)['@graph'][0].name).toBe('</script><b>');
  });
});
