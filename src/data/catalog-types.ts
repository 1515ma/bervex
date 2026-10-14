/** Tipos do catálogo da loja BERVEX. */

export type CategoryId =
  | 'pisos-vinilicos'
  | 'pisos-de-borracha'
  | 'grama-e-tatame'
  | 'anilhas'
  | 'halteres'
  | 'dumbbells'
  | 'kettlebells'
  | 'barras'
  | 'puxadores'
  | 'suportes'
  | 'acessorios';

export type CategoryGroup = 'pisos' | 'fitness';

export interface Category {
  id: CategoryId;
  group: CategoryGroup;
  name: string;
  /** Nome curto para menus e filtros. */
  shortName: string;
  title: string;
  description: string;
  intro: string;
  image: string;
}

export interface OptionValue {
  value: string;
  label: string;
  /** Chave de imagem (ex.: "products/tatame-eva--azul" ou "vinyl/durafloor-city/oslo"). */
  image?: string;
  /** Cor de bolinha para opções de cor sem foto. */
  swatch?: string;
}

export interface ProductOption {
  id: string;
  label: string;
  values: OptionValue[];
}

export interface ProductUnit {
  singular: string;
  plural: string;
  /** Dica curta ao lado do campo de quantidade. */
  hint?: string;
}

/** Cobertura em m² por unidade vendida, para calcular a quantidade pela área. */
export interface ProductCoverage {
  marginPercent: number;
  /** m² por unidade; ausente quando a venda já é em m². */
  unitAreaM2?: number;
  /** Quando a área por unidade depende de uma opção (ex.: tamanho do tatame). */
  unitAreaByOption?: { optionId: string; areas: Record<string, number> };
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  image: string;
  summary: string;
  description: string;
  specs: SpecItem[];
  options: ProductOption[];
  unit: ProductUnit;
  coverage?: ProductCoverage;
  featured?: boolean;
  badge?: string;
}
