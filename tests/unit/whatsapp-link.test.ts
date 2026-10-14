import { describe, expect, it } from 'vitest';
import { calculateFloorQuote } from '../../src/lib/floor-calculator';
import {
  buildContactMessage,
  buildFloorQuoteMessage,
  buildWhatsAppLink,
  formatMeters,
} from '../../src/lib/whatsapp-link';

describe('buildWhatsAppLink', () => {
  it('remove a máscara do número e codifica a mensagem', () => {
    const link = buildWhatsAppLink('+55 (11) 91234-5678', 'Olá & tudo bem?');

    expect(link).toBe('https://wa.me/5511912345678?text=Ol%C3%A1%20%26%20tudo%20bem%3F');
  });

  it('omite o texto quando a mensagem está vazia', () => {
    expect(buildWhatsAppLink('5511912345678', '   ')).toBe('https://wa.me/5511912345678');
  });

  it.each(['123', '1234567890123456', ''])('recusa número inválido "%s"', (phone) => {
    expect(() => buildWhatsAppLink(phone, 'oi')).toThrow(/inválido/);
  });
});

describe('formatMeters', () => {
  it('usa vírgula decimal e duas casas', () => {
    expect(formatMeters(21)).toBe('21,00');
    expect(formatMeters(1250.5)).toBe('1.250,50');
  });
});

describe('buildFloorQuoteMessage', () => {
  it('descreve medidas, margem e placas para academia', () => {
    const quote = calculateFloorQuote({ application: 'academia-musculacao', lengthM: 5, widthM: 4 });
    const message = buildFloorQuoteMessage({ quote, lengthM: 5, widthM: 4 });

    expect(message).toContain('Academia: musculação e peso livre');
    expect(message).toContain('5,00 × 4,00 m = 20,00 m²');
    expect(message).toContain('Com 5% de margem: 21,00 m²');
    expect(message).toContain('21 placas de 1,00 × 1,00 m, espessura 20 mm');
    expect(message.split('\n').at(-1)).toBe('Cidade/UF: ');
  });

  it('inclui a altura de queda no playground', () => {
    const quote = calculateFloorQuote({ application: 'playground', lengthM: 4, widthM: 3, fallHeightM: 1.2 });
    const message = buildFloorQuoteMessage({ quote, lengthM: 4, widthM: 3, fallHeightM: 1.2 });

    expect(message).toContain('Altura de queda do brinquedo: 1,20 m.');
    expect(message).toContain('a partir de 40 mm');
  });

  it('não fala em placas no vinílico', () => {
    const quote = calculateFloorQuote({ application: 'vinilico', lengthM: 6, widthM: 5 });
    const message = buildFloorQuoteMessage({ quote, lengthM: 6, widthM: 5 });

    expect(message).not.toContain('placas');
    expect(message).toContain('Indicação: click ou colado, conforme o uso.');
  });
});

describe('buildContactMessage', () => {
  it('monta a frase com nome, cidade e interesse', () => {
    expect(buildContactMessage({ name: ' Ana ', city: 'Campinas/SP', interest: 'piso vinílico' })).toBe(
      'Olá, BERVEX! Sou Ana, de Campinas/SP. Quero um orçamento de piso vinílico.',
    );
  });

  it('funciona com campos vazios', () => {
    expect(buildContactMessage({ name: '', city: '', interest: '' })).toBe(
      'Olá, BERVEX! Quero um orçamento de pisos e equipamentos.',
    );
  });

  it('funciona só com a cidade', () => {
    expect(buildContactMessage({ name: '', city: 'Recife/PE', interest: 'anilhas' })).toBe(
      'Olá, BERVEX! Escrevo de Recife/PE. Quero um orçamento de anilhas.',
    );
  });
});
