import { SITE_URL } from './site-url.mjs';

/**
 * Dados institucionais da BERVEX, num único lugar.
 * Tudo marcado com TODO(cliente) é provisório e precisa ser confirmado antes de publicar.
 */
export interface BervexSiteConfig {
  name: string;
  legalName: string;
  url: string;
  locale: string;
  tagline: string;
  description: string;
  /** Somente dígitos, com DDI e DDD (ex.: 5511912345678). */
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  instagramUrl: string;
  serviceArea: string;
  /** days em inglês, como o schema.org pede (Monday, Tuesday...). */
  openingHours: { label: string; days: string[]; opens: string; closes: string }[];
  logoPath: string;
  ogImagePath: string;
  /** Dados legais exibidos na privacidade e nos termos. Vazio = "a informar". */
  cnpj: string;
  address: string;
  privacyEmail: string;
}

export const BERVEX_SITE: BervexSiteConfig = {
  name: 'BERVEX',
  legalName: 'BERVEX Pisos, Revestimentos e Fitness', // TODO(cliente): razão social e CNPJ
  url: SITE_URL,
  locale: 'pt-BR',
  tagline: 'Pisos, revestimentos e fitness',
  description:
    'Loja de piso vinílico, piso de borracha, grama sintética, tatame e equipamentos fitness: anilhas, halteres, dumbbells, kettlebells, barras e puxadores. Monte o carrinho e finalize pelo WhatsApp.',
  whatsappNumber: '5500000000000', // TODO(cliente): número real do WhatsApp comercial
  whatsappDisplay: '(00) 00000-0000', // TODO(cliente)
  email: 'contato@bervex.com.br', // TODO(cliente)
  instagramUrl: 'https://www.instagram.com/bervex', // TODO(cliente)
  serviceArea: 'Brasil',
  openingHours: [
    // TODO(cliente): confirmar horário de atendimento
    {
      label: 'Segunda a sexta, 8h às 18h',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    { label: 'Sábado, 8h às 12h', days: ['Saturday'], opens: '08:00', closes: '12:00' },
  ],
  logoPath: '/brand/bervex-logo.png',
  ogImagePath: '/brand/og-bervex.jpg',
  cnpj: '', // TODO(cliente)
  address: '', // TODO(cliente): endereço completo
  privacyEmail: 'privacidade@bervex.com.br', // TODO(cliente): e-mail do encarregado de dados (LGPD)
};

export const CONTACT_PAGE_PATH = '/contato/';
export const CART_PAGE_PATH = '/carrinho/';
