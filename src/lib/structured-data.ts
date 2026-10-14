/**
 * Geradores de JSON-LD (schema.org) para as páginas da BERVEX.
 * Recebem a configuração do site por parâmetro: nada aqui lê arquivo ou rede.
 */
import type { BervexSiteConfig } from '../config/site';

type JsonLd = Record<string, unknown>;

export interface Breadcrumb {
  name: string;
  path: string;
}

export interface CatalogItem {
  name: string;
  description: string;
  imagePath?: string;
  category: string;
  url?: string;
}

export function toAbsoluteUrl(site: BervexSiteConfig, path: string): string {
  return new URL(path, site.url).toString();
}

function organizationId(site: BervexSiteConfig): string {
  return `${toAbsoluteUrl(site, '/')}#organizacao`;
}

function websiteId(site: BervexSiteConfig): string {
  return `${toAbsoluteUrl(site, '/')}#site`;
}

export function buildOrganizationSchema(site: BervexSiteConfig): JsonLd {
  return {
    '@type': 'Organization',
    '@id': organizationId(site),
    name: site.name,
    legalName: site.legalName,
    url: toAbsoluteUrl(site, '/'),
    logo: { '@type': 'ImageObject', url: toAbsoluteUrl(site, site.logoPath) },
    image: toAbsoluteUrl(site, site.ogImagePath),
    description: site.description,
    slogan: site.tagline,
    email: site.email,
    areaServed: { '@type': 'Country', name: site.serviceArea },
    knowsAbout: [
      'Piso vinílico',
      'Piso de borracha para academia',
      'Piso emborrachado para playground',
      'Equipamentos de academia',
      'Anilhas',
      'Halteres',
      'Kettlebells',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: `+${site.whatsappNumber}`,
      availableLanguage: 'Portuguese',
      areaServed: 'BR',
      hoursAvailable: site.openingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
        opens: h.opens,
        closes: h.closes,
      })),
    },
    sameAs: [site.instagramUrl],
  };
}

export function buildWebSiteSchema(site: BervexSiteConfig): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: toAbsoluteUrl(site, '/'),
    name: site.name,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': organizationId(site) },
  };
}

export function buildBreadcrumbSchema(site: BervexSiteConfig, crumbs: Breadcrumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: toAbsoluteUrl(site, crumb.path),
    })),
  };
}

export interface WebPageSchemaInput {
  path: string;
  title: string;
  description: string;
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
  imagePath?: string;
}

export function buildWebPageSchema(site: BervexSiteConfig, page: WebPageSchemaInput): JsonLd {
  const url = toAbsoluteUrl(site, page.path);
  return {
    '@type': page.type ?? 'WebPage',
    '@id': `${url}#pagina`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: site.locale,
    isPartOf: { '@id': websiteId(site) },
    about: { '@id': organizationId(site) },
    ...(page.imagePath ? { primaryImageOfPage: toAbsoluteUrl(site, page.imagePath) } : {}),
  };
}

/**
 * Lista dos produtos de uma categoria (ItemList com URL de cada página).
 * Sem marcação Product: a loja não publica preço, e Product sem offers/review é sinalizado como inválido.
 */
export function buildItemListSchema(site: BervexSiteConfig, name: string, items: CatalogItem[]): JsonLd {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { url: toAbsoluteUrl(site, item.url) } : {}),
      ...(item.imagePath ? { image: toAbsoluteUrl(site, item.imagePath) } : {}),
    })),
  };
}

export function buildSchemaGraph(nodes: JsonLd[]): string {
  const graph = { '@context': 'https://schema.org', '@graph': nodes };
  // Evita que "</script>" dentro de um texto feche a tag antes da hora.
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
