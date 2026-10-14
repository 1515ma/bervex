/**
 * Catálogo da loja BERVEX, montado a partir dos catálogos de pisos vinílicos e fitness.
 * Não há preço: o cliente monta o carrinho e recebe valor e frete pelo WhatsApp.
 */
import type { Category, CategoryId, Product, SpecItem } from './catalog-types';
import {
  BORE_31,
  BORE_51,
  HALTER_WEIGHTS,
  PLATE_WEIGHTS,
  RUBBER_COLORS,
  UNIT,
  boreOption,
  colorOption,
  thicknessOption,
  weightOption,
  weightRange,
} from './catalog-options';
import vinylCollections from './vinyl-collections.json';

export type { Category, CategoryId, Product } from './catalog-types';

/* ------------------------------------------------------------------ categorias */

export const CATEGORIES: Category[] = [
  {
    id: 'pisos-vinilicos',
    group: 'pisos',
    name: 'Pisos vinílicos',
    shortName: 'Vinílicos',
    title: 'Piso vinílico colado e SPC',
    description:
      'Piso vinílico colado e SPC em padrões madeira, pedra e cimento: Durafloor e EspaçoFloor para casa, loja e escritório. Escolha a cor e peça pelo WhatsApp.',
    intro:
      'Linhas Durafloor e EspaçoFloor em padrões madeira, pedra e cimento. Vendidos por m², com instalação colada ou SPC, para casa, loja, escritório e academia.',
    image: 'vinyl/durafloor-inova/_mosaico',
  },
  {
    id: 'pisos-de-borracha',
    group: 'pisos',
    name: 'Pisos de borracha',
    shortName: 'Borracha',
    title: 'Piso de borracha para academia',
    description:
      'Piso de borracha para academia em placas 1 × 1 m (15 a 50 mm) e 50 × 50 cm, rampa de acabamento e piso moeda. Sete cores. Calcule as placas e peça pelo WhatsApp.',
    intro:
      'Placas de 1 × 1 m e 50 × 50 cm que absorvem impacto e ruído, rampa de acabamento e piso moeda. Sete cores para academias, garagens e playgrounds.',
    image: 'products/piso-de-borracha-1x1',
  },
  {
    id: 'grama-e-tatame',
    group: 'pisos',
    name: 'Grama sintética e tatame',
    shortName: 'Grama e tatame',
    title: 'Grama sintética e tatame EVA',
    description:
      'Grama sintética verde e colorida em rolos e tatame EVA 50 × 50 cm e 1 × 1 m em 10 cores e espessuras de 10 a 40 mm. Peça pelo WhatsApp.',
    intro:
      'Grama sintética verde e colorida para áreas esportivas e decoração, e tatame EVA em 10 cores para lutas, funcional e áreas infantis.',
    image: 'products/grama-sintetica-verde',
  },
  {
    id: 'anilhas',
    group: 'fitness',
    name: 'Anilhas',
    shortName: 'Anilhas',
    title: 'Anilhas de 1 a 25 kg',
    description:
      'Anilhas vazadas, sport, injetadas e emborrachadas de 1 a 25 kg, com furação 31 mm ou 51 mm olímpica. Monte seu pedido e finalize pelo WhatsApp.',
    intro: 'Ferro pintado, emborrachadas e injetadas, de 1 a 25 kg, para barra comum (31 mm) ou olímpica (51 mm).',
    image: 'products/anilha-sport-vazada-emborrachada',
  },
  {
    id: 'halteres',
    group: 'fitness',
    name: 'Halteres',
    shortName: 'Halteres',
    title: 'Halteres de 1 a 10 kg',
    description:
      'Halteres bola, sextavados e monobloco de 1 a 10 kg: pintados, emborrachados, TX e injetados, com pegada cromada ou inteiriços. Peça pelo WhatsApp.',
    intro: 'Bola, sextavados e monobloco de 1 a 10 kg, inteiriços ou com pegada cromada, e kit com suporte.',
    image: 'products/halter-sextavado-emborrachado-pegada-cromada',
  },
  {
    id: 'dumbbells',
    group: 'fitness',
    name: 'Dumbbells',
    shortName: 'Dumbbells',
    title: 'Dumbbells de 2 a 100 kg',
    description:
      'Dumbbells sextavados, monobloco e injetados de 2 a 100 kg, com pegada cromada, recartilhada ou emborrachada. Kits de 10 pares. Peça pelo WhatsApp.',
    intro: 'Sextavados, redondos e monobloco para academias e home gym, de 2 a 100 kg, e kits de 10 pares.',
    image: 'products/dumbbell-sextavado-emborrachado-pegada-cromada',
  },
  {
    id: 'kettlebells',
    group: 'fitness',
    name: 'Kettlebells',
    shortName: 'Kettlebells',
    title: 'Kettlebells de 4 a 32 kg',
    description: 'Kettlebells pintados e emborrachados de 4 a 32 kg para treino funcional e cross training. Peça pelo WhatsApp.',
    intro: 'Pintados e emborrachados, de 4 a 32 kg, para funcional, cross training e treino em casa.',
    image: 'products/kettlebell-pintado',
  },
  {
    id: 'barras',
    group: 'fitness',
    name: 'Barras',
    shortName: 'Barras',
    title: 'Barras olímpicas, W e montadas',
    description:
      'Barra olímpica cromada de 10, 15 e 20 kg, barra W e H, barra hexagonal, barra reta maciça e barras montadas vulcanizadas de 10 a 44 kg.',
    intro: 'Olímpicas, W, H, hexagonal, retas maciças e barras montadas vulcanizadas de 10 a 44 kg.',
    image: 'products/barra-hexagonal-preta',
  },
  {
    id: 'puxadores',
    group: 'fitness',
    name: 'Puxadores',
    shortName: 'Puxadores',
    title: 'Puxadores para polia e cross over',
    description:
      'Puxadores pretos e cromados para polia: pulley, tríceps, triângulo, estribo, romano, V, corda e kits anatômicos. Monte seu pedido pelo WhatsApp.',
    intro: 'Pretos com pintura eletrostática ou cromados: pulley, tríceps, triângulo, estribo, romano, V, corda e kits.',
    image: 'products/puxador-triangulo-cromado-grande',
  },
  {
    id: 'suportes',
    group: 'fitness',
    name: 'Suportes',
    shortName: 'Suportes',
    title: 'Suportes para anilhas, dumbbells e barras',
    description:
      'Suportes para dumbbells de 5 e 10 pares, kettlebells, wall ball, anilhas (300 e 500 kg) e barras olímpicas. Organize sua academia.',
    intro: 'Racks para dumbbells, kettlebells, wall balls, anilhas e barras, para deixar a academia organizada.',
    image: 'products/suporte-5-pares-dumbbell',
  },
  {
    id: 'acessorios',
    group: 'fitness',
    name: 'Acessórios e aparelhos',
    shortName: 'Acessórios',
    title: 'Acessórios fitness e aparelhos',
    description:
      'Wall ball de couro, step de EVA, tijolinho, mini jump, caneleira e simulador de escada. Complete sua academia e peça pelo WhatsApp.',
    intro: 'Wall ball, step, tijolinho, mini jump, caneleiras e simulador de escada.',
    image: 'products/wall-ball-couro',
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;

/* ------------------------------------------------------------------ pisos vinílicos */

const VINYL_SPECS_BASE: SpecItem[] = [
  { label: 'Composição', value: 'PVC 100% virgem' },
  { label: 'Norma', value: 'ABNT NBR 14917-2' },
  { label: 'Venda', value: 'Por m², em caixas do lote' },
  { label: 'Limpeza', value: 'Pano úmido com detergente neutro' },
];

interface VinylMeta {
  type: string;
  summary: string;
  description: string;
  use: string;
  thickness?: string;
  featured?: boolean;
}

const VINYL_META: Record<string, VinylMeta> = {
  'durafloor-nativa': {
    type: 'Vinílico SPC',
    summary: 'Visual de madeira natural com superfície resistente a riscos e manchas.',
    description:
      'O Durafloor Nativa reproduz a madeira com textura sofisticada e cria ambientes aconchegantes. A superfície resiste a riscos e manchas, a manutenção é simples e o piso aguenta áreas de alto tráfego, em casa ou no comércio.',
    use: 'Residencial e comercial',
    featured: true,
  },
  'spot-pisos-home': {
    type: 'Vinílico colado',
    summary: 'Linha residencial com textura suave ao toque e padrões amadeirados.',
    description:
      'O Spot Pisos Home tem textura agradável ao toque e padrões amadeirados para qualquer cômodo. A instalação colada acompanha os contornos do ambiente, e o piso é resistente ao desgaste e fácil de limpar.',
    use: 'Residencial e comercial leve',
    thickness: '2 mm',
  },
  'espacofloor-office-plus': {
    type: 'Vinílico LVT colado',
    summary: 'Cimento, carpete, quartzo e madeira para escritórios e lojas.',
    description:
      'O EspaçoFloor Office Plus foi feito para áreas comerciais de alto tráfego, com padrões de cimento, carpete, quartzo e madeira. É confortável ao caminhar, fácil de manter e resistente a manchas e calor.',
    use: 'Escritórios, lojas e recepções',
  },
  'durafloor-art': {
    type: 'Vinílico LVT colado',
    summary: 'Madeiras nobres com camada que protege contra riscos e desbotamento.',
    description:
      'Cada régua do Durafloor Art reproduz a beleza de madeiras nobres. A camada superior protege contra riscos, manchas e descoloração, e a base adesiva deixa o piso firme, sem frestas para acumular sujeira.',
    use: 'Residencial e comercial',
  },
  'espacofloor-office-plus-plus': {
    type: 'Vinílico LVT colado',
    summary: 'Pedra e cimento para recepções e ambientes corporativos.',
    description:
      'O EspaçoFloor Office Plus+ traz padrões realistas de pedra e cimento para escritórios e recepções. A superfície resiste a riscos e manchas e a limpeza é feita com produtos comuns.',
    use: 'Ambientes corporativos',
  },
  'espacofloor-office-square': {
    type: 'Vinílico colado em placas',
    summary: 'Padrão geométrico em cinzas neutros para escritórios.',
    description:
      'O EspaçoFloor Office Square tem padrão geométrico em tons neutros para escritórios e espaços comerciais. Resiste a desgaste e manchas, deixa o caminhar mais confortável e ajuda a reduzir ruídos.',
    use: 'Escritórios e comércio',
  },
  'espacofloor-royal-wood': {
    type: 'Vinílico colado',
    summary: 'Textura fiel à madeira em tons de carvalho.',
    description:
      'O EspaçoFloor Royal Wood combina textura fiel à madeira natural com a resistência do vinil e fabricação ecologicamente responsável. Manutenção simples e longa vida útil.',
    use: 'Residencial e comercial',
  },
  'espacofloor-royal-mild': {
    type: 'Vinílico colado',
    summary: 'Freixo, nogueira e acácia em nuances suaves.',
    description:
      'O EspaçoFloor Royal Mild tem textura suave e uma paleta de nuances que combina com vários estilos. Indicado para escritórios, lojas e áreas comerciais de alto tráfego.',
    use: 'Escritórios e lojas',
  },
  'espacofloor-office-wood': {
    type: 'Vinílico colado',
    summary: 'Charme da madeira com a resistência do vinil.',
    description:
      'O EspaçoFloor Office Wood traz o visual da madeira para ambientes comerciais de alto tráfego, com superfície resistente a manchas e fácil de limpar.',
    use: 'Ambientes comerciais',
  },
  'espacofloor-soft': {
    type: 'Vinílico colado',
    summary: 'Toque aconchegante e isolamento acústico.',
    description:
      'O EspaçoFloor Soft une textura suave e tecnologia de isolamento acústico, deixando o ambiente mais silencioso. Resiste a impactos e manchas, mesmo em espaços de grande circulação.',
    use: 'Residencial e comercial',
    featured: true,
  },
  'durafloor-city': {
    type: 'Vinílico LVT colado',
    summary: 'Paleta inspirada na estética urbana.',
    description:
      'O Durafloor City tem design moderno, superfície resistente e manutenção fácil. A paleta de cores urbanas funciona em casas e comércios.',
    use: 'Residencial e comercial',
  },
  'espacofloor-office-mild': {
    type: 'Vinílico colado',
    summary: 'Seis padrões para ambientes corporativos.',
    description:
      'O EspaçoFloor Office Mild tem superfície suave e muito resistente para áreas de uso constante, com seis padrões para personalizar escritórios e salas comerciais.',
    use: 'Ambientes corporativos',
  },
  'durafloor-inova': {
    type: 'Vinílico LVT colado',
    summary: 'Camada de desgaste reforçada e nove padrões.',
    description:
      'O Durafloor Inova tem camada de desgaste altamente resistente, textura suave e absorção de impacto. São nove padrões de madeira, pedra e cimento para casas e comércios.',
    use: 'Residencial e comercial',
    featured: true,
  },
  'flooring-imperial': {
    type: 'Vinílico colado',
    summary: 'Doze cores vibrantes para projetos com personalidade.',
    description:
      'O Flooring Imperial vem em 12 cores e texturas exclusivas, do esmeralda ao dourado, para projetos que querem cor no chão. Superfície resistente, confortável e fácil de limpar.',
    use: 'Comercial, clínicas e lazer',
  },
  'durafloor-urban': {
    type: 'Vinílico LVT colado',
    summary: 'Resistente a riscos, impactos e umidade, em dez padrões.',
    description:
      'O Durafloor Urban é resistente a riscos, impactos e umidade, com camada de proteção que facilita a limpeza. Dez padrões contemporâneos para casas e comércios.',
    use: 'Residencial e comercial',
  },
};

type VinylJson = Record<string, { title: string; colors: { name: string; slug: string }[] }>;

const VINYL_PRODUCTS: Product[] = Object.entries(vinylCollections as VinylJson).map(([slug, col]) => {
  const meta = VINYL_META[slug];
  return {
    slug: `piso-vinilico-${slug}`,
    name: `Piso vinílico ${col.title}`,
    category: 'pisos-vinilicos',
    image: `vinyl/${slug}/_mosaico`,
    summary: meta.summary,
    description: meta.description,
    specs: [
      { label: 'Tipo', value: meta.type },
      { label: 'Uso indicado', value: meta.use },
      { label: 'Espessura', value: meta.thickness ?? 'Conforme o lote' },
      { label: 'Cores', value: `${col.colors.length} opções` },
      ...VINYL_SPECS_BASE,
    ],
    options: [
      {
        id: 'cor',
        label: 'Cor',
        values: col.colors.map((c) => ({ value: c.slug, label: c.name, image: `vinyl/${slug}/${c.slug}` })),
      },
    ],
    unit: { ...UNIT.m2, hint: 'Some 10% para recortes.' },
    coverage: { marginPercent: 10 },
    featured: meta.featured,
  } satisfies Product;
});

/* ------------------------------------------------------------------ pisos de borracha, grama e tatame */

const FLOOR_PRODUCTS: Product[] = [
  {
    slug: 'piso-de-borracha-1x1',
    name: 'Piso de borracha 1 × 1 m',
    category: 'pisos-de-borracha',
    image: 'products/piso-de-borracha-1x1',
    summary: 'Placa de 1 m² de 15 a 50 mm para academias e áreas de peso livre.',
    description:
      'Placa de borracha de 1,00 × 1,00 m que absorve impacto e ruído, protege o contrapiso e deixa a área de treino antiderrapante. Use 15 a 20 mm em musculação e cardio e 30 a 50 mm onde a barra cai no chão.',
    specs: [
      { label: 'Medida', value: '1,00 × 1,00 m (1 m² por placa)' },
      { label: 'Espessuras', value: '15, 20, 25, 30, 40 e 50 mm' },
      { label: 'Cores', value: 'Preto, azul, verde, vermelho, cinza, amarelo e laranja' },
      { label: 'Uso indicado', value: 'Academias, cross training, garagens e home gym' },
    ],
    options: [thicknessOption([15, 20, 25, 30, 40, 50]), colorOption(RUBBER_COLORS)],
    unit: { ...UNIT.placa, hint: 'Cada placa cobre 1 m².' },
    coverage: { marginPercent: 5, unitAreaM2: 1 },
    featured: true,
    badge: 'Mais vendido',
  },
  {
    slug: 'piso-de-borracha-50x50',
    name: 'Piso de borracha 50 × 50 cm',
    category: 'pisos-de-borracha',
    image: 'products/piso-de-borracha-50x50',
    summary: 'Placa de 0,25 m² de 11 a 20 mm, fácil de cortar e montar.',
    description:
      'Placa de borracha de 0,50 × 0,50 m para áreas menores, cantos e playgrounds. É leve para transportar, fácil de recortar e absorve o impacto de pesos e quedas.',
    specs: [
      { label: 'Medida', value: '0,50 × 0,50 m (4 placas por m²)' },
      { label: 'Espessuras', value: '11, 15 e 20 mm' },
      { label: 'Cores', value: 'Preto, azul, verde, vermelho, cinza, amarelo e laranja' },
      { label: 'Uso indicado', value: 'Home gym, playgrounds e áreas pequenas' },
    ],
    options: [thicknessOption([11, 15, 20]), colorOption(RUBBER_COLORS)],
    unit: { ...UNIT.placa, hint: 'São 4 placas por m².' },
    coverage: { marginPercent: 5, unitAreaM2: 0.25 },
  },
  {
    slug: 'rampa-acabamento-borracha',
    name: 'Rampa de acabamento de borracha',
    category: 'pisos-de-borracha',
    image: 'products/rampa-acabamento-borracha',
    summary: 'Arremate em rampa para as bordas do piso de borracha.',
    description:
      'Rampa de borracha que faz a transição entre o piso de borracha e o restante do ambiente, evitando tropeços nas bordas. Disponível nas mesmas cores das placas.',
    specs: [
      { label: 'Espessuras', value: '15 e 20 mm' },
      { label: 'Cores', value: 'Preto, azul, verde, vermelho, cinza, amarelo e laranja' },
    ],
    options: [thicknessOption([15, 20]), colorOption(RUBBER_COLORS)],
    unit: UNIT.peca,
  },
  {
    slug: 'piso-moeda',
    name: 'Piso moeda de borracha',
    category: 'pisos-de-borracha',
    image: 'products/piso-moeda',
    summary: 'Placa de 3 mm com relevo moeda, em 10 cores.',
    description:
      'Piso de borracha com relevo em moedas que deixa a superfície antiderrapante. Ótimo para rampas, corredores, áreas comerciais e academias, em placas de 50 × 50 ou 45 × 45 cm.',
    specs: [
      { label: 'Tamanhos', value: '50 × 50 cm e 45 × 45 cm' },
      { label: 'Espessura', value: '3 mm' },
      { label: 'Cores', value: 'Preto, azul, verde, vermelho, cinza, marrom, amarelo, laranja, rosa e roxo' },
    ],
    options: [
      {
        id: 'tamanho',
        label: 'Tamanho',
        values: [
          { value: '50x50', label: '50 × 50 cm', image: 'products/piso-moeda--50x50' },
          { value: '45x45', label: '45 × 45 cm', image: 'products/piso-moeda--45x45' },
        ],
      },
      colorOption(['preto', 'azul', 'verde', 'vermelho', 'cinza', 'marrom', 'amarelo', 'laranja', 'rosa', 'roxo']),
    ],
    unit: UNIT.placa,
    coverage: { marginPercent: 5, unitAreaByOption: { optionId: 'tamanho', areas: { '50x50': 0.25, '45x45': 0.2025 } } },
  },
  {
    slug: 'grama-sintetica-verde',
    name: 'Grama sintética verde',
    category: 'grama-e-tatame',
    image: 'products/grama-sintetica-verde',
    summary: 'Rolos de 2 × 25 m ou 2 × 40 m com fio de 8 a 20 mm.',
    description:
      'Grama sintética verde com aspecto natural e baixíssima manutenção, para áreas esportivas, playgrounds, varandas e decoração. Escolha a altura do fio e o tamanho do rolo.',
    specs: [
      { label: 'Rolos', value: '2 × 25 m e 2 × 40 m' },
      { label: 'Altura do fio', value: '8, 12, 15 e 20 mm' },
      { label: 'Cor', value: 'Verde' },
    ],
    options: [
      { id: 'altura', label: 'Altura do fio', values: [8, 12, 15, 20].map((v) => ({ value: String(v), label: `${v} mm` })) },
      {
        id: 'rolo',
        label: 'Rolo',
        values: [
          { value: '2x25', label: '2 × 25 m' },
          { value: '2x40', label: '2 × 40 m' },
        ],
      },
    ],
    unit: UNIT.rolo,
    featured: true,
  },
  {
    slug: 'grama-sintetica-colorida',
    name: 'Grama sintética colorida',
    category: 'grama-e-tatame',
    image: 'products/grama-sintetica-colorida',
    summary: 'Fio de 12 mm em sete cores para decoração e áreas de lazer.',
    description:
      'Grama sintética colorida com fio de 12 mm para festas, vitrines, áreas infantis e decoração. Disponível em amarelo, azul, branco, preto, rosa, vermelho e roxo.',
    specs: [
      { label: 'Rolo', value: '2 × 40 m' },
      { label: 'Altura do fio', value: '12 mm' },
      { label: 'Cores', value: 'Amarelo, azul, branco, preto, rosa, vermelho e roxo' },
    ],
    options: [colorOption(['amarelo', 'azul', 'branco', 'preto', 'rosa', 'vermelho', 'roxo'], 'products/grama-sintetica-colorida')],
    unit: UNIT.rolo,
  },
  {
    slug: 'tatame-eva',
    name: 'Tatame EVA',
    category: 'grama-e-tatame',
    image: 'products/tatame-eva',
    summary: 'Placas de encaixe 50 × 50 cm ou 1 × 1 m, de 10 a 40 mm, em 10 cores.',
    description:
      'Tatame de EVA com encaixe para lutas, funcional, pilates e espaços infantis. Amortece quedas, isola o frio do chão e monta sem ferramentas.',
    specs: [
      { label: 'Tamanhos', value: '50 × 50 cm e 1 × 1 m' },
      { label: 'Espessuras', value: '10, 15, 20, 30 e 40 mm' },
      { label: 'Cores', value: 'Amarelo, azul, branco, preto, cinza, rosa, roxo, vermelho, laranja e verde' },
    ],
    options: [
      {
        id: 'tamanho',
        label: 'Tamanho',
        values: [
          { value: '50x50', label: '50 × 50 cm' },
          { value: '1x1', label: '1 × 1 m' },
        ],
      },
      thicknessOption([10, 15, 20, 30, 40]),
      colorOption(['preto', 'cinza', 'azul', 'vermelho', 'verde', 'amarelo', 'laranja', 'rosa', 'roxo', 'branco'], 'products/tatame-eva'),
    ],
    unit: UNIT.placa,
    coverage: { marginPercent: 5, unitAreaByOption: { optionId: 'tamanho', areas: { '50x50': 0.25, '1x1': 1 } } },
    featured: true,
  },
];

/* ------------------------------------------------------------------ fitness */

interface SimpleProduct {
  slug: string;
  name: string;
  summary: string;
  description: string;
  specs?: SpecItem[];
  featured?: boolean;
  badge?: string;
}

function fitnessProduct(
  category: CategoryId,
  base: SimpleProduct,
  options: Product['options'],
  unit: Product['unit'] = UNIT.unidade,
): Product {
  return {
    slug: base.slug,
    name: base.name,
    category,
    image: `products/${base.slug}`,
    summary: base.summary,
    description: base.description,
    specs: base.specs ?? [],
    options,
    unit,
    featured: base.featured,
    badge: base.badge,
  };
}

const PLATE_TEXT = 'Vendida por unidade; para montar a barra, peça em pares.';

const ANILHAS: Product[] = [
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-vazada-ferro-pintada',
      name: 'Anilha vazada de ferro pintada',
      summary: 'Ferro fundido com pintura, 1 a 25 kg, furação 31 mm.',
      description: `Anilha clássica de ferro fundido com pintura e pegas vazadas que facilitam carregar e trocar a carga. ${PLATE_TEXT}`,
      specs: [{ label: 'Material', value: 'Ferro fundido pintado' }],
    },
    [weightOption(PLATE_WEIGHTS), boreOption([BORE_31])],
  ),
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-vazada-emborrachada',
      name: 'Anilha vazada emborrachada',
      summary: 'Revestimento de borracha que protege o piso, 1 a 25 kg.',
      description: `Anilha vazada com revestimento de borracha: faz menos barulho, não marca o piso e é mais confortável de pegar. ${PLATE_TEXT}`,
      specs: [{ label: 'Material', value: 'Ferro com revestimento de borracha' }],
    },
    [weightOption(PLATE_WEIGHTS), boreOption([BORE_51])],
  ),
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-vazada-injetada',
      name: 'Anilha vazada injetada',
      summary: 'Acabamento injetado, 1 a 20 kg, furação 31 ou 51 mm.',
      description: `Anilha com acabamento injetado, resistente a impactos e ao uso diário em academias. ${PLATE_TEXT}`,
      specs: [{ label: 'Acabamento', value: 'Injetado' }],
    },
    [weightOption(PLATE_WEIGHTS.filter((kg) => kg <= 20)), boreOption([BORE_31, BORE_51])],
  ),
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-injetada-dectagonal-com-anel',
      name: 'Anilha injetada dectagonal com anel',
      summary: 'Formato de 10 lados que não rola, com anel metálico, 1 a 25 kg.',
      description: `Anilha injetada de formato dectagonal, que não rola no chão, com anel metálico no furo para durar mais na barra olímpica. ${PLATE_TEXT}`,
      specs: [{ label: 'Formato', value: 'Dectagonal com anel metálico' }],
    },
    [weightOption(PLATE_WEIGHTS), boreOption([BORE_51])],
  ),
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-sport-vazada-ferro-pintada',
      name: 'Anilha sport vazada de ferro pintada',
      summary: 'Três pegas vazadas, 1 a 25 kg, furação 31 ou 51 mm.',
      description: `Anilha sport de ferro pintado com três pegas vazadas, para segurar firme na hora de trocar a carga ou fazer exercícios com a própria anilha. ${PLATE_TEXT}`,
      specs: [{ label: 'Material', value: 'Ferro fundido pintado' }],
    },
    [weightOption(PLATE_WEIGHTS), boreOption([BORE_31, BORE_51])],
  ),
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-sport-vazada-emborrachada',
      name: 'Anilha sport vazada emborrachada',
      summary: 'Três pegas e revestimento de borracha, 1 a 25 kg.',
      description: `A anilha mais versátil: três pegas vazadas e revestimento de borracha que abafa o barulho e protege o piso. ${PLATE_TEXT}`,
      specs: [{ label: 'Material', value: 'Ferro com revestimento de borracha' }],
      featured: true,
    },
    [weightOption(PLATE_WEIGHTS), boreOption([BORE_31, BORE_51])],
  ),
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-injetada-evoluxion',
      name: 'Anilha injetada Evoluxion',
      summary: 'Injetada em preto e vermelho, 1 a 20 kg, furação olímpica.',
      description: `Anilha injetada com acabamento em preto e vermelho e pegas anatômicas, para academias que querem equipamento com visual marcante. ${PLATE_TEXT}`,
      specs: [{ label: 'Acabamento', value: 'Injetado preto e vermelho' }],
    },
    [weightOption(PLATE_WEIGHTS.filter((kg) => kg <= 20)), boreOption([BORE_51])],
  ),
  fitnessProduct(
    'anilhas',
    {
      slug: 'anilha-olimpica-injetada',
      name: 'Anilha olímpica injetada',
      summary: 'Injetada em cinza, 5 a 25 kg, para barra olímpica.',
      description: `Anilha injetada para barra olímpica, de 5 a 25 kg, com pegas vazadas e acabamento que resiste ao uso intenso. ${PLATE_TEXT}`,
      specs: [{ label: 'Acabamento', value: 'Injetado' }],
    },
    [weightOption([5, 10, 15, 20, 25]), boreOption([BORE_51])],
  ),
];

const HALTER_SPEC = { label: 'Pesos', value: '1 a 10 kg' };

function halter(slug: string, name: string, summary: string, description: string, featured = false): Product {
  return fitnessProduct(
    'halteres',
    { slug, name, summary, description, specs: [HALTER_SPEC], featured },
    [weightOption(HALTER_WEIGHTS)],
    UNIT.par,
  );
}

const HALTERES: Product[] = [
  halter('halter-bola-pintado', 'Halter bola pintado', 'Ferro pintado com pontas arredondadas, 1 a 10 kg.', 'Halter de ferro inteiriço com pontas em bola, compacto e resistente, para treinos em casa, pilates e funcional.'),
  halter('halter-bola-emborrachado', 'Halter bola emborrachado', 'Revestido de borracha, 1 a 10 kg.', 'Halter bola com revestimento de borracha que protege o piso e é confortável na mão.'),
  halter('halter-sextavado-pintado-inteirico', 'Halter sextavado pintado inteiriço', 'Peça única de ferro com cabeças sextavadas que não rolam.', 'Halter inteiriço de ferro pintado com cabeças sextavadas, que ficam paradas no chão entre as séries.'),
  halter('halter-sextavado-emborrachado-inteirico', 'Halter sextavado emborrachado inteiriço', 'Peça única revestida de borracha, 1 a 10 kg.', 'Halter sextavado inteiriço com revestimento de borracha, silencioso e gentil com o piso.'),
  halter('halter-sextavado-tx-inteirico', 'Halter sextavado TX inteiriço', 'Acabamento texturizado TX, 1 a 10 kg.', 'Halter sextavado inteiriço com pintura texturizada TX, que melhora a pegada e resiste a riscos.'),
  halter('halter-sextavado-pintado-pegada-cromada', 'Halter sextavado pintado com pegada cromada', 'Cabeças sextavadas e pegada cromada recartilhada.', 'Halter de cabeças sextavadas pintadas com pegada cromada recartilhada, que não escorrega com o suor.'),
  halter('halter-sextavado-tx-pegada-cromada', 'Halter sextavado TX com pegada cromada', 'Cabeças TX e pegada cromada, 1 a 10 kg.', 'Halter com cabeças sextavadas em acabamento TX e pegada cromada recartilhada.'),
  halter('halter-sextavado-emborrachado-pegada-cromada', 'Halter sextavado emborrachado com pegada cromada', 'O modelo de academia: emborrachado com pegada cromada.', 'O halter mais pedido em academias: cabeças sextavadas emborrachadas que protegem o piso e pegada cromada recartilhada.', true),
  halter('halter-sextavado-injetado-pegada-cromada', 'Halter sextavado injetado com pegada cromada', 'Cabeças injetadas e pegada cromada, 1 a 10 kg.', 'Halter de cabeças sextavadas injetadas, resistentes a impacto, com pegada cromada.'),
  halter('halter-monobloco-tx-pegada-cromada', 'Halter monobloco TX com pegada cromada', 'Cabeças redondas TX e pegada cromada.', 'Halter monobloco de cabeças redondas com acabamento TX e pegada cromada recartilhada.'),
  halter('halter-monobloco-pintado-pegada-cromada', 'Halter monobloco pintado com pegada cromada', 'Cabeças redondas pintadas e pegada cromada.', 'Halter monobloco com cabeças redondas pintadas e pegada cromada recartilhada.'),
  fitnessProduct(
    'halteres',
    {
      slug: 'kit-halter-sextavado-com-suporte',
      name: 'Kit halter sextavado com suporte',
      summary: 'Pares de 1 a 10 kg em torre vertical.',
      description: 'Kit de halteres sextavados injetados de 1 a 10 kg com suporte vertical, que organiza tudo ocupando pouco espaço.',
      specs: [{ label: 'Conteúdo', value: 'Pares de 1 a 10 kg e suporte vertical' }],
    },
    [],
    UNIT.kit,
  ),
];

const DUMBBELL_HEAVY = [...weightRange(12, 50, 2), 55, 60, 65, 70, 75, 100];

function dumbbell(slug: string, name: string, summary: string, description: string, weights: number[], featured = false): Product {
  const range = `${String(weights[0]).replace('.', ',')} a ${String(weights[weights.length - 1]).replace('.', ',')} kg`;
  return fitnessProduct(
    'dumbbells',
    { slug, name, summary, description, specs: [{ label: 'Pesos', value: range }], featured },
    [weightOption(weights)],
    UNIT.par,
  );
}

const DUMBBELLS: Product[] = [
  dumbbell('dumbbell-sextavado-pintado-inteirico', 'Dumbbell sextavado pintado inteiriço', 'Peça única de ferro pintado, 12 a 32 kg.', 'Dumbbell inteiriço de ferro pintado com cabeças sextavadas, robusto para o dia a dia da academia.', weightRange(12, 32, 2)),
  dumbbell('dumbbell-sextavado-emborrachado-inteirico', 'Dumbbell sextavado emborrachado inteiriço', 'Peça única emborrachada, 12 a 32 kg.', 'Dumbbell inteiriço com cabeças sextavadas emborrachadas, que protegem o piso e reduzem o barulho.', weightRange(12, 32, 2)),
  dumbbell('dumbbell-sextavado-tx-inteirico', 'Dumbbell sextavado TX inteiriço', 'Acabamento texturizado TX, 12 a 32 kg.', 'Dumbbell inteiriço com pintura texturizada TX, resistente a riscos e com pegada firme.', weightRange(12, 32, 2)),
  dumbbell('dumbbell-monobloco-tx-pegada-cromada', 'Dumbbell monobloco TX com pegada cromada', 'Cabeças redondas TX, 12 a 30 kg.', 'Dumbbell monobloco de cabeças redondas TX com pegada cromada recartilhada.', weightRange(12, 30, 2)),
  dumbbell('dumbbell-monobloco-pintado-pegada-recartilhada', 'Dumbbell monobloco pintado com pegada recartilhada', 'Anilhas fixas pintadas, 12 a 30 kg.', 'Dumbbell monobloco com anilhas fixas pintadas e pegada recartilhada para não escorregar.', weightRange(12, 30, 2)),
  dumbbell('dumbbell-importado-injetado-pegada-recartilhada', 'Dumbbell importado injetado com pegada recartilhada', 'Cabeças injetadas, 12,5 a 35 kg.', 'Dumbbell importado com cabeças injetadas e pegada recartilhada, em pesos com passo de 2,5 kg.', weightRange(12.5, 35, 2.5)),
  dumbbell('dumbbell-sextavado-monobloco-injetado', 'Dumbbell sextavado monobloco injetado', 'Sextavado com pegada injetada, 12 a 30 kg.', 'Dumbbell sextavado monobloco totalmente injetado, inclusive a pegada, resistente a impactos.', weightRange(12, 30, 2)),
  dumbbell('dumbbell-monobloco-redondo-injetado', 'Dumbbell monobloco redondo injetado', 'Cabeças redondas injetadas, 2 a 50 kg.', 'Dumbbell monobloco de cabeças redondas e pegada injetada, numa grade completa de 2 a 50 kg.', weightRange(2, 50, 2)),
  dumbbell('dumbbell-injetado-pegada-recartilhada', 'Dumbbell injetado com pegada recartilhada', 'Anilhas injetadas, 6 a 60 kg.', 'Dumbbell com anilhas injetadas e pegada recartilhada, de 6 a 60 kg.', weightRange(6, 60, 2)),
  dumbbell('dumbbell-pintado-pegada-emborrachada', 'Dumbbell pintado com pegada emborrachada', 'Anilhas pintadas e pegada de borracha, 6 a 60 kg.', 'Dumbbell com anilhas pintadas e pegada emborrachada, confortável em séries longas.', weightRange(6, 60, 2)),
  dumbbell('dumbbell-emborrachado-pegada-emborrachada', 'Dumbbell emborrachado com pegada emborrachada', 'Todo emborrachado, 6 a 60 kg.', 'Dumbbell com anilhas e pegada emborrachadas, silencioso e gentil com o piso.', weightRange(6, 60, 2)),
  dumbbell('dumbbell-monobloco-tx-pegada-recartilhada', 'Dumbbell monobloco TX com pegada recartilhada', 'Acabamento TX, 12 a 30 kg.', 'Dumbbell monobloco com acabamento texturizado TX e pegada recartilhada.', weightRange(12, 30, 2)),
  dumbbell('dumbbell-sextavado-pintado-pegada-cromada', 'Dumbbell sextavado pintado com pegada cromada', 'Sextavado pintado, 12 a 100 kg.', 'Dumbbell de cabeças sextavadas pintadas e pegada cromada, com pesos até 100 kg para academias completas.', DUMBBELL_HEAVY),
  dumbbell('dumbbell-sextavado-emborrachado-pegada-cromada', 'Dumbbell sextavado emborrachado com pegada cromada', 'O padrão das academias, 12 a 100 kg.', 'O dumbbell padrão das academias: cabeças sextavadas emborrachadas, pegada cromada recartilhada e pesos até 100 kg.', DUMBBELL_HEAVY, true),
  dumbbell('dumbbell-sextavado-tx-pegada-cromada', 'Dumbbell sextavado TX com pegada cromada', 'Acabamento TX, 12 a 100 kg.', 'Dumbbell sextavado com acabamento TX e pegada cromada, com pesos até 100 kg.', DUMBBELL_HEAVY),
  fitnessProduct(
    'dumbbells',
    {
      slug: 'kit-dumbbell-importado-10-pares',
      name: 'Kit dumbbell importado com 10 pares',
      summary: 'Dez pares injetados com suporte.',
      description: 'Kit com 10 pares de dumbbells importados injetados, pegada recartilhada, e suporte para deixar a área de peso livre pronta.',
      specs: [{ label: 'Conteúdo', value: '10 pares de dumbbells e suporte' }],
    },
    [],
    UNIT.kit,
  ),
];

const KETTLEBELLS: Product[] = [
  fitnessProduct(
    'kettlebells',
    {
      slug: 'kettlebell-pintado',
      name: 'Kettlebell pintado',
      summary: 'Ferro fundido pintado, 4 a 32 kg.',
      description: 'Kettlebell de ferro fundido com pintura e alça larga para swings, agachamentos, arranques e treino funcional.',
      specs: [{ label: 'Pesos', value: '4 a 32 kg' }],
      featured: true,
    },
    [weightOption(weightRange(4, 32, 2))],
  ),
  fitnessProduct(
    'kettlebells',
    {
      slug: 'kettlebell-emborrachado',
      name: 'Kettlebell emborrachado',
      summary: 'Revestido de borracha, 4 a 32 kg.',
      description: 'Kettlebell revestido de borracha que protege o piso e reduz o barulho, ideal para salas de funcional e treino em casa.',
      specs: [{ label: 'Pesos', value: '4 a 32 kg' }],
    },
    [weightOption(weightRange(4, 32, 2))],
  ),
];

const BARRAS: Product[] = [
  fitnessProduct(
    'barras',
    {
      slug: 'barra-olimpica-cromada',
      name: 'Barra olímpica cromada',
      summary: 'Júnior 10 kg, feminina 15 kg, masculina 20 kg e modelos curtos.',
      description: 'Barra olímpica cromada para anilhas de 51 mm, em versões júnior, feminina e masculina, além de modelos curtos para supino e rosca.',
      specs: [{ label: 'Furação das anilhas', value: '51 mm (olímpica)' }],
      featured: true,
    },
    [
      {
        id: 'modelo',
        label: 'Modelo',
        values: [
          { value: 'masculina-20kg', label: 'Masculina 20 kg · 2,20 m' },
          { value: 'feminina-15kg', label: 'Feminina 15 kg · 2,00 m' },
          { value: 'junior-10kg', label: 'Júnior 10 kg · 1,62 m' },
          { value: '1-80m', label: '1,80 m' },
          { value: '1-50m', label: '1,50 m' },
          { value: '1-20m', label: '1,20 m' },
        ],
      },
    ],
  ),
  fitnessProduct(
    'barras',
    {
      slug: 'barra-reta-macica-cromada',
      name: 'Barra reta maciça cromada',
      summary: 'Recartilhada com presilha espiral, de 0,30 a 2,20 m.',
      description: 'Barra reta maciça cromada e recartilhada, com presilhas espirais, para anilhas de furação 31 mm.',
      specs: [{ label: 'Furação das anilhas', value: '31 mm (comum)' }],
    },
    [
      {
        id: 'comprimento',
        label: 'Comprimento',
        values: ['0,30', '0,40', '1,20', '1,50', '1,80', '2,00', '2,20'].map((m) => ({ value: m.replace(',', '-'), label: `${m} m` })),
      },
    ],
  ),
  fitnessProduct(
    'barras',
    {
      slug: 'barra-hexagonal-preta',
      name: 'Barra hexagonal preta',
      summary: 'Trap bar com pegada cromada recartilhada.',
      description: 'Barra hexagonal (trap bar) para levantamento terra e encolhimento com a carga alinhada ao corpo, protegendo a lombar.',
      specs: [{ label: 'Pegada', value: 'Cromada recartilhada' }],
    },
    [],
  ),
  fitnessProduct(
    'barras',
    {
      slug: 'barra-olimpica-w',
      name: 'Barra olímpica W cromada',
      summary: 'Barra W de 1,20 m para rosca e tríceps.',
      description: 'Barra W olímpica cromada de 1,20 m, com ângulos que aliviam os punhos na rosca direta e no tríceps.',
      specs: [{ label: 'Comprimento', value: '1,20 m' }],
    },
    [],
  ),
  fitnessProduct(
    'barras',
    {
      slug: 'barra-olimpica-h',
      name: 'Barra olímpica H cromada',
      summary: 'Pegada neutra para rosca martelo e tríceps.',
      description: 'Barra H olímpica cromada com pegadas paralelas para rosca martelo e tríceps com punho neutro.',
    },
    [],
  ),
  fitnessProduct(
    'barras',
    {
      slug: 'barra-reta-montada-vulcanizada',
      name: 'Barra reta montada vulcanizada',
      summary: 'Carga fixa emborrachada, 10 a 44 kg.',
      description: 'Barra reta com anilhas fixas vulcanizadas: é só pegar e treinar, sem trocar carga. Ideal para aulas coletivas e áreas de peso livre.',
      specs: [{ label: 'Pesos', value: '10 a 44 kg' }],
    },
    [weightOption(weightRange(10, 44, 2))],
  ),
  fitnessProduct(
    'barras',
    {
      slug: 'barra-w-montada-vulcanizada',
      name: 'Barra W montada vulcanizada',
      summary: 'Barra W com carga fixa, 10 a 44 kg.',
      description: 'Barra W com anilhas fixas vulcanizadas para rosca e tríceps sem perder tempo trocando peso.',
      specs: [{ label: 'Pesos', value: '10 a 44 kg' }],
    },
    [weightOption(weightRange(10, 44, 2))],
  ),
];

function puxador(slug: string, name: string, summary: string, description: string, featured = false): Product {
  const finish = slug.includes('cromad') ? 'Cromado' : 'Preto com pintura eletrostática';
  return fitnessProduct('puxadores', { slug, name, summary, description, specs: [{ label: 'Acabamento', value: finish }], featured }, []);
}

const PUXADORES: Product[] = [
  puxador('puxador-anatomico-costa-multipegada', 'Puxador anatômico costas multipegada', 'Várias pegadas para puxada de costas.', 'Puxador anatômico com várias pegadas para variar a puxada alta e trabalhar diferentes regiões das costas.'),
  puxador('puxador-pulley-curvo-articulado-preto', 'Puxador pulley curvo articulado 1,20 m preto', 'Barra curva de 1,20 m com manoplas.', 'Barra pulley curva de 1,20 m com manoplas e articulação central para puxada alta.'),
  puxador('puxador-pulley-reto-articulado-preto', 'Puxador pulley reto articulado 1,20 m preto', 'Barra reta de 1,20 m com manoplas.', 'Barra pulley reta de 1,20 m com manoplas e articulação para puxadas e remadas.'),
  puxador('puxador-triceps-reto-preto', 'Puxador tríceps reto 50 cm preto', 'Barra curta com giro para tríceps.', 'Barra reta de 50 cm com manoplas e giro, para tríceps na polia.'),
  puxador('puxador-triceps-bigode-preto', 'Puxador tríceps bigode maciço preto', 'Formato bigode com manoplas e giro.', 'Puxador maciço em formato bigode com manoplas e giro, para tríceps com punho confortável.'),
  puxador('puxador-triceps-curvo-preto', 'Puxador tríceps curvo 50 cm preto', 'Barra curva de 50 cm com giro.', 'Barra curva de 50 cm com manoplas e giro para tríceps e rosca na polia.'),
  puxador('puxador-romano-d-curvo-preto', 'Puxador romano D curvo preto', 'Barra curva com pegadas em D.', 'Puxador romano com barra curva e pegadas em D, articulado, para puxadas com pegada neutra.'),
  puxador('puxador-v-articulado-preto', 'Puxador V articulado preto', 'Pegada em V com manoplas.', 'Puxador em V articulado com manoplas, para remada baixa e puxada com pegada neutra.'),
  puxador('puxador-multipegada-preto', 'Puxador multipegada preto', 'Grade com pegadas aberta, fechada e neutra.', 'Puxador em grade com várias pegadas, aberta, fechada e neutra, num só acessório.'),
  puxador('puxador-romano-d-articulado-preto', 'Puxador romano D articulado preto', 'Barra reta com pegadas em D.', 'Barra reta articulada com pegadas em D nas pontas para puxadas e remadas.'),
  puxador('puxador-tornozeleira-polia-baixa', 'Puxador tornozeleira para polia baixa', 'Tornozeleira acolchoada com argola.', 'Tornozeleira acolchoada com argola para exercícios de glúteo e perna na polia baixa.'),
  puxador('puxador-rotativo-360-triceps', 'Puxador rotativo 360 tríceps preto', 'Manoplas que giram 360°.', 'Puxador com manoplas rotativas 360° que acompanham o movimento natural do punho no tríceps.'),
  puxador('puxador-rotativo-pulley-com-giro', 'Puxador rotativo pulley com giro', 'Pegadas rotativas para pulley.', 'Puxador pulley com pegadas rotativas que deixam o punho livre durante a puxada.'),
  puxador('puxador-rotativo-360-escapular', 'Puxador rotativo 360 escapular', 'Pegadas rotativas para escápulas.', 'Puxador com pegadas rotativas 360° para exercícios escapulares e de ombro.'),
  puxador('puxador-triangulo-preto-grande', 'Puxador triângulo preto grande', 'Triângulo grande com giro.', 'Puxador triângulo grande com giro, para remada baixa com pegada neutra.'),
  puxador('puxador-triangulo-preto-pequeno', 'Puxador triângulo preto pequeno', 'Triângulo pequeno com giro.', 'Puxador triângulo pequeno com giro, para remada e tríceps com pegada fechada.'),
  puxador('puxador-estribo-fechado-preto', 'Puxador estribo fechado preto', 'Pegada unilateral com manopla.', 'Estribo fechado com manopla para exercícios unilaterais no cross over.'),
  puxador('puxador-estribo-aberto-preto', 'Puxador estribo aberto preto', 'Estribo aberto com manopla.', 'Estribo aberto com manopla para crucifixo e exercícios unilaterais na polia.'),
  puxador('puxador-corda', 'Puxador corda', 'Corda de tríceps com terminais de borracha.', 'Corda para tríceps, face pull e rosca martelo na polia, com terminais de borracha.'),
  puxador('puxador-triceps-reto-cromado', 'Puxador tríceps reto articulado 50 cm cromado', 'Barra cromada de 50 cm com manoplas.', 'Barra reta articulada de 50 cm cromada com manoplas para tríceps.'),
  puxador('puxador-pulley-curvo-articulado-cromado', 'Puxador pulley curvo articulado 1,20 m cromado', 'Barra curva cromada de 1,20 m.', 'Barra pulley curva de 1,20 m cromada com manoplas e articulação.'),
  puxador('puxador-pulley-reto-articulado-cromado', 'Puxador pulley reto articulado 1,20 m cromado', 'Barra reta cromada de 1,20 m.', 'Barra pulley reta de 1,20 m cromada com manoplas e articulação.'),
  puxador('puxador-v-cromado', 'Puxador V cromado com giro', 'Pegada em V cromada com giro.', 'Puxador em V cromado com manoplas e giro para remada e puxada neutra.'),
  puxador('puxador-triceps-bigode-cromado', 'Puxador tríceps bigode maciço cromado', 'Formato bigode cromado com giro.', 'Puxador maciço cromado em formato bigode com manoplas e giro, para tríceps.'),
  puxador('puxador-romano-d-38-cromado', 'Puxador romano D ângulo 38° cromado', 'Pegadas em D a 38°.', 'Puxador romano cromado com pegadas em D inclinadas a 38° para puxada alta.'),
  puxador('puxador-triceps-curvo-cromado', 'Puxador tríceps curvo articulado 50 cm cromado', 'Barra curva cromada de 50 cm.', 'Barra curva articulada de 50 cm cromada com manoplas, para tríceps e rosca.'),
  puxador('puxador-romano-d-articulado-cromado', 'Puxador romano D articulado cromado', 'Barra cromada com pegadas em D.', 'Barra reta articulada cromada com pegadas em D nas pontas.'),
  puxador('puxador-estribo-fechado-cromado', 'Puxador estribo fechado cromado', 'Estribo cromado com manopla.', 'Estribo fechado cromado com manopla para exercícios unilaterais.'),
  puxador('puxador-estribo-crossover-cromado', 'Puxador estribo cross over cromado', 'Estribo largo para cross over.', 'Estribo cromado largo, próprio para cross over e crucifixo na polia.'),
  puxador('puxador-triangulo-cromado-grande', 'Puxador triângulo cromado grande', 'Triângulo cromado grande com giro.', 'Puxador triângulo cromado grande com giro para remada baixa.', true),
  puxador('puxador-triangulo-cromado-pequeno', 'Puxador triângulo cromado pequeno', 'Triângulo cromado pequeno com giro.', 'Puxador triângulo cromado pequeno com giro para remada e tríceps.'),
  fitnessProduct(
    'puxadores',
    {
      slug: 'kit-puxadores-anatomicos',
      name: 'Kit puxadores anatômicos',
      summary: 'Kits com 3, 5, 6 ou 7 puxadores.',
      description: 'Kit de puxadores anatômicos com pegadas para costas, tríceps e remada, para equipar a polia de uma vez.',
      specs: [{ label: 'Acabamento', value: 'Preto com pintura eletrostática' }],
    },
    [
      {
        id: 'kit',
        label: 'Kit',
        values: [
          { value: '7', label: '7 puxadores', image: 'products/kit-puxadores-anatomicos--7' },
          { value: '6', label: '6 puxadores', image: 'products/kit-puxadores-anatomicos--6' },
          { value: '5', label: '5 puxadores', image: 'products/kit-puxadores-anatomicos--5' },
          { value: '3', label: '3 puxadores', image: 'products/kit-puxadores-anatomicos--3' },
        ],
      },
    ],
    UNIT.kit,
  ),
];

function suporte(slug: string, name: string, summary: string, description: string): Product {
  return fitnessProduct('suportes', { slug, name, summary, description }, []);
}

const SUPORTES: Product[] = [
  suporte('suporte-5-pares-dumbbell', 'Suporte para 5 pares de dumbbell', 'Rack de dois andares para 5 pares.', 'Rack de dois andares para 5 pares de dumbbells montados, firme e fácil de alcançar.'),
  suporte('suporte-10-pares-dumbbell', 'Suporte para 10 pares de dumbbell', 'Rack de dois andares para 10 pares.', 'Rack de dois andares para 10 pares de dumbbells montados, para áreas de peso livre.'),
  suporte('suporte-dumbbell-importado-10-pares', 'Suporte para 10 pares de dumbbell importado', 'Rack para dumbbells injetados recartilhados.', 'Suporte para 10 pares de dumbbells importados injetados com pegada recartilhada.'),
  suporte('suporte-barras-montadas-10-pares', 'Suporte para barras retas e W montadas', 'Torre para 10 barras montadas.', 'Suporte vertical para 10 barras retas e W montadas vulcanizadas.'),
  suporte('expositor-halter-10-pares', 'Expositor de halteres 10 pares', 'Expositor para 10 pares de halteres.', 'Expositor para 10 pares de halteres, que deixa a carga à vista e organizada.'),
  suporte('suporte-kettlebell', 'Suporte para kettlebell', 'Bandejas em dois níveis.', 'Suporte em dois níveis com bandejas para guardar kettlebells sem rolar.'),
  suporte('estante-kettlebell-wall-ball', 'Estante para kettlebell e wall ball', 'Estante com quatro prateleiras.', 'Estante com quatro prateleiras para kettlebells, wall balls e acessórios.'),
  suporte('suporte-kettlebell-wall-ball', 'Suporte horizontal para kettlebell e wall ball', 'Rack baixo de dois níveis.', 'Rack horizontal de dois níveis para kettlebells e wall balls.'),
  suporte('suporte-anilha-500kg', 'Suporte para anilha 500 kg', 'Árvore em A para até 500 kg.', 'Suporte em formato A para anilhas, com capacidade para até 500 kg.'),
  suporte('suporte-anilha-em-t', 'Suporte para anilha em T 300 kg', 'Árvore em T para até 300 kg.', 'Suporte em T para anilhas, compacto, com capacidade para até 300 kg.'),
  suporte('suporte-parede-barra-olimpica', 'Suporte de parede para 10 barras olímpicas', 'Guarda 10 barras na vertical.', 'Suporte de parede que guarda 10 barras olímpicas na vertical, liberando o chão.'),
];

const ACESSORIOS: Product[] = [
  fitnessProduct(
    'acessorios',
    {
      slug: 'wall-ball-couro',
      name: 'Wall ball de couro',
      summary: 'Bola de arremesso de 2 a 16 kg.',
      description: 'Wall ball revestida de couro sintético resistente, para arremessos, agachamentos e treinos de cross training.',
      specs: [{ label: 'Pesos', value: '2 a 16 kg' }],
      featured: true,
    },
    [weightOption([2, 3, 4, 6, 8, 10, 12, 14, 16])],
  ),
  fitnessProduct(
    'acessorios',
    {
      slug: 'step-eva',
      name: 'Step de EVA',
      summary: 'Step firme e leve em três tamanhos.',
      description: 'Step de EVA de alta densidade, leve e antiderrapante, para aulas de step, funcional e fisioterapia.',
    },
    [
      {
        id: 'tamanho',
        label: 'Tamanho',
        values: [
          { value: '90x30x15', label: '90 × 30 × 15 cm' },
          { value: '60x30x15', label: '60 × 30 × 15 cm' },
          { value: '60x30x10', label: '60 × 30 × 10 cm' },
        ],
      },
    ],
  ),
  fitnessProduct(
    'acessorios',
    {
      slug: 'tijolinho-injetado',
      name: 'Tijolinho injetado',
      summary: 'Peso com três pegas, 5 ou 6,5 kg.',
      description: 'Tijolinho injetado com três pegas para treinos funcionais, agachamentos e exercícios com carga na mão.',
    },
    [weightOption([5, 6.5])],
  ),
  fitnessProduct(
    'acessorios',
    {
      slug: 'tijolinho-pintado',
      name: 'Tijolinho pintado',
      summary: 'Ferro pintado com três pegas, 5 ou 6,5 kg.',
      description: 'Tijolinho de ferro pintado com três pegas para treino funcional e exercícios com carga na mão.',
    },
    [weightOption([5, 6.5])],
  ),
  fitnessProduct(
    'acessorios',
    {
      slug: 'jump-32-molas',
      name: 'Jump mini trampolim 32 molas',
      summary: 'Mini trampolim para aulas de jump.',
      description: 'Mini trampolim com 32 molas para aulas de jump, aeróbico de baixo impacto e treino em casa.',
    },
    [],
  ),
  fitnessProduct(
    'acessorios',
    {
      slug: 'caneleira-tornozeleira',
      name: 'Caneleira tornozeleira',
      summary: 'Caneleira com velcro de 1 a 20 kg.',
      description: 'Caneleira tornozeleira com fechamento em velcro para exercícios de perna e glúteo, de 1 a 20 kg.',
      specs: [{ label: 'Pesos', value: '1 a 20 kg' }],
    },
    [weightOption(weightRange(1, 20, 1))],
    UNIT.par,
  ),
  fitnessProduct(
    'acessorios',
    {
      slug: 'simulador-de-escada',
      name: 'Simulador de escada',
      summary: 'Aparelho de escada rolante para cardio intenso.',
      description: 'Simulador de escada para academias: cardio intenso que trabalha pernas e glúteos com baixo impacto nas articulações.',
    },
    [],
  ),
];

export const PRODUCTS: Product[] = [
  ...FLOOR_PRODUCTS.filter((p) => p.category === 'pisos-de-borracha'),
  ...VINYL_PRODUCTS,
  ...FLOOR_PRODUCTS.filter((p) => p.category === 'grama-e-tatame'),
  ...ANILHAS,
  ...HALTERES,
  ...DUMBBELLS,
  ...KETTLEBELLS,
  ...BARRAS,
  ...PUXADORES,
  ...SUPORTES,
  ...ACESSORIOS,
];

export const PRODUCT_BY_SLUG = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p])) as Record<string, Product>;

export function productsInCategory(id: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === id);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function productPath(product: Pick<Product, 'slug'>): string {
  return `/produto/${product.slug}/`;
}

export function categoryPath(id: CategoryId): string {
  return `/loja/${id}/`;
}
