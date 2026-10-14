import { describe, expect, it } from 'vitest';
import {
  buildContactRequestMessage,
  buildMailtoLink,
  contactRequestProblems,
  type ContactRequest,
} from '../../src/lib/contact-request';

const base: ContactRequest = {
  name: '  Ana   Souza ',
  phone: '(11) 91234-5678',
  email: 'ana@exemplo.com',
  subject: 'Montar academia completa',
  city: 'Guarulhos/SP',
  message: 'Tenho uma sala de 30 m² e quero piso de 20 mm e anilhas.',
};

describe('buildContactRequestMessage', () => {
  it('monta assunto, mensagem e dados de retorno', () => {
    const text = buildContactRequestMessage(base);

    expect(text.split('\n')[0]).toBe('Olá, BERVEX! Assunto: Montar academia completa.');
    expect(text).toContain('Tenho uma sala de 30 m²');
    expect(text).toContain('Nome: Ana Souza');
    expect(text).toContain('Telefone: (11) 91234-5678');
    expect(text).toContain('Cidade/CEP: Guarulhos/SP');
  });

  it('omite campos vazios', () => {
    const text = buildContactRequestMessage({ ...base, email: '', phone: '', city: '', message: '' });

    expect(text).not.toContain('E-mail');
    expect(text).not.toContain('Telefone');
  });
});

describe('buildMailtoLink', () => {
  it('codifica assunto e corpo', () => {
    const link = buildMailtoLink('contato@bervex.com.br', base);
    const url = new URL(link);

    expect(url.protocol).toBe('mailto:');
    expect(url.searchParams.get('subject')).toBe('Montar academia completa | Ana Souza');
    expect(url.searchParams.get('body')).toContain('Nome: Ana Souza');
  });
});

describe('contactRequestProblems', () => {
  it('aceita um pedido completo', () => {
    expect(contactRequestProblems(base)).toEqual([]);
  });

  it('pede nome e e-mail válido', () => {
    expect(contactRequestProblems({ ...base, name: ' ', email: 'ana@' })).toEqual([
      'Informe seu nome.',
      'Confira o e-mail digitado.',
    ]);
  });

  it('pede o assunto ou a mensagem', () => {
    expect(contactRequestProblems({ ...base, subject: '', message: '' })).toContain('Conte o que você procura.');
  });
});
