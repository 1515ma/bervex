import { describe, expect, it } from 'vitest';
import {
  MAX_QUANTITY,
  addToCart,
  buildOrderMessage,
  cartCount,
  cartLineKey,
  formatQuantity,
  loadCart,
  normalizeQuantity,
  parseCart,
  removeLine,
  saveCart,
  serializeCart,
  setLineQuantity,
  type CartLine,
  type CartStorage,
  type NewCartLine,
} from '../../src/lib/cart';

const anilha: NewCartLine = {
  slug: 'anilha-sport-vazada-emborrachada',
  name: 'Anilha sport vazada emborrachada',
  options: [
    { label: 'Peso', value: '10 kg' },
    { label: 'Furação', value: '51 mm (barra olímpica)' },
  ],
  quantity: 2,
  unitSingular: 'unidade',
  unitPlural: 'unidades',
};

const piso: NewCartLine = {
  slug: 'piso-de-borracha-1x1',
  name: 'Piso de borracha 1 × 1 m',
  options: [
    { label: 'Espessura', value: '20 mm' },
    { label: 'Cor', value: 'Preto' },
  ],
  quantity: 26,
  unitSingular: 'placa',
  unitPlural: 'placas',
};

function memoryStorage(initial: string | null = null): CartStorage & { value: string | null } {
  return {
    value: initial,
    read() {
      return this.value;
    },
    write(v: string) {
      this.value = v;
    },
  };
}

describe('addToCart', () => {
  it('adiciona uma linha nova com chave por produto e opções', () => {
    const lines = addToCart([], anilha);

    expect(lines).toHaveLength(1);
    expect(lines[0].key).toBe(cartLineKey(anilha.slug, anilha.options));
  });

  it('soma a quantidade quando produto e opções são os mesmos', () => {
    const lines = addToCart(addToCart([], anilha), { ...anilha, quantity: 3 });

    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(5);
  });

  it('separa linhas quando a opção muda', () => {
    const other = { ...anilha, options: [{ label: 'Peso', value: '20 kg' }, anilha.options[1]] };
    const lines = addToCart(addToCart([], anilha), other);

    expect(cartCount(lines)).toBe(2);
  });

  it('ignora quantidade zero, negativa ou inválida', () => {
    expect(addToCart([], { ...anilha, quantity: 0 })).toEqual([]);
    expect(addToCart([], { ...anilha, quantity: -3 })).toEqual([]);
    expect(addToCart([], { ...anilha, quantity: Number.NaN })).toEqual([]);
  });

  it('não altera a lista original', () => {
    const original: CartLine[] = [];
    addToCart(original, anilha);

    expect(original).toEqual([]);
  });
});

describe('setLineQuantity e removeLine', () => {
  it('troca a quantidade e remove quando chega a zero', () => {
    const lines = addToCart([], anilha);
    const key = lines[0].key;

    expect(setLineQuantity(lines, key, 8)[0].quantity).toBe(8);
    expect(setLineQuantity(lines, key, 0)).toEqual([]);
    expect(removeLine(lines, key)).toEqual([]);
  });
});

describe('normalizeQuantity', () => {
  it('limita ao máximo e arredonda em 2 casas', () => {
    expect(normalizeQuantity(MAX_QUANTITY + 50)).toBe(MAX_QUANTITY);
    expect(normalizeQuantity(12.345)).toBe(12.35);
  });
});

describe('parseCart / serializeCart', () => {
  it('faz ida e volta', () => {
    const lines = addToCart(addToCart([], anilha), piso);

    expect(parseCart(serializeCart(lines))).toEqual(lines);
  });

  it.each([null, '', 'not json', '{"v":2,"lines":[]}', '{"v":1,"lines":"x"}'])('devolve vazio para %s', (raw) => {
    expect(parseCart(raw)).toEqual([]);
  });

  it('descarta linhas com opções malformadas e limita a quantidade', () => {
    const good = addToCart([], piso)[0];
    const raw = JSON.stringify({
      v: 1,
      lines: [
        { ...good, options: [null] },
        { ...good, quantity: 1e12 },
      ],
    });
    const lines = parseCart(raw);

    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(MAX_QUANTITY);
  });

  it('só aceita links e imagens do próprio site', () => {
    const good = addToCart([], piso)[0];
    const raw = JSON.stringify({ v: 1, lines: [{ ...good, url: 'javascript:alert(1)', image: '//evil.example/x.png' }] });
    const [line] = parseCart(raw);

    expect(line.url).toBeUndefined();
    expect(line.image).toBeUndefined();
  });

  it('descarta linhas malformadas', () => {
    const raw = JSON.stringify({ v: 1, lines: [{ key: 'x' }, { ...addToCart([], piso)[0] }] });

    expect(parseCart(raw)).toHaveLength(1);
  });
});

describe('loadCart / saveCart', () => {
  it('usa o armazenamento injetado', () => {
    const storage = memoryStorage();
    saveCart(storage, addToCart([], piso));

    expect(loadCart(storage)[0].slug).toBe('piso-de-borracha-1x1');
  });

  it('não quebra quando o armazenamento lança erro', () => {
    const broken: CartStorage = {
      read: () => {
        throw new Error('bloqueado');
      },
      write: () => {
        throw new Error('bloqueado');
      },
    };

    expect(loadCart(broken)).toEqual([]);
    expect(() => saveCart(broken, [])).not.toThrow();
  });
});

describe('formatQuantity', () => {
  it('usa singular, plural e vírgula decimal', () => {
    expect(formatQuantity({ quantity: 1, unitSingular: 'placa', unitPlural: 'placas' })).toBe('1 placa');
    expect(formatQuantity({ quantity: 26, unitSingular: 'placa', unitPlural: 'placas' })).toBe('26 placas');
    expect(formatQuantity({ quantity: 33.5, unitSingular: 'm²', unitPlural: 'm²' })).toBe('33,5 m²');
  });
});

describe('buildOrderMessage', () => {
  it('lista os itens com opções, quantidade e dados do cliente', () => {
    const lines = addToCart(addToCart([], anilha), piso);
    const message = buildOrderMessage(lines, { name: ' Ana ', city: 'Guarulhos/SP' });

    expect(message).toContain('Olá, BERVEX! Quero fazer este pedido:');
    expect(message).toContain(
      '1. Anilha sport vazada emborrachada (Peso: 10 kg, Furação: 51 mm (barra olímpica)): 2 unidades',
    );
    expect(message).toContain('2. Piso de borracha 1 × 1 m (Espessura: 20 mm, Cor: Preto): 26 placas');
    expect(message).toContain('Nome: Ana');
    expect(message).toContain('Cidade/CEP: Guarulhos/SP');
  });

  it('marca campos vazios do cliente com traço', () => {
    const message = buildOrderMessage(addToCart([], { ...anilha, options: [] }), { name: '', city: '' });

    expect(message).toContain('1. Anilha sport vazada emborrachada: 2 unidades');
    expect(message).toContain('Nome: -');
  });
});
