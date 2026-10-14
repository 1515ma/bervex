/**
 * Formulário de contato: transforma os campos numa mensagem para WhatsApp ou num link mailto.
 * Lógica pura; o envio (abrir WhatsApp ou o app de e-mail) acontece no navegador.
 */

export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  subject: string;
  city: string;
  message: string;
}

export const CONTACT_SUBJECTS = [
  'Orçamento de piso vinílico',
  'Orçamento de piso de borracha',
  'Orçamento de equipamentos fitness',
  'Montar academia completa',
  'Grama sintética ou tatame',
  'Dúvida sobre um pedido',
  'Outro assunto',
] as const;

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function buildContactRequestMessage(req: ContactRequest): string {
  const lines = [`Olá, BERVEX! Assunto: ${clean(req.subject) || 'Contato pelo site'}.`];
  const message = req.message.trim();
  if (message) lines.push('', message);
  const details = [
    ['Nome', clean(req.name)],
    ['Telefone', clean(req.phone)],
    ['E-mail', clean(req.email)],
    ['Cidade/CEP', clean(req.city)],
  ].filter(([, v]) => v);
  if (details.length) lines.push('', ...details.map(([k, v]) => `${k}: ${v}`));
  return lines.join('\n');
}

export function buildMailtoLink(to: string, req: ContactRequest): string {
  const subject = `${clean(req.subject) || 'Contato pelo site'} | ${clean(req.name) || 'site BERVEX'}`;
  const body = buildContactRequestMessage(req);
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Validação mínima: precisa de nome e de alguma forma de retorno (telefone ou e-mail) ou mensagem. */
export function contactRequestProblems(req: ContactRequest): string[] {
  const problems: string[] = [];
  if (!clean(req.name)) problems.push('Informe seu nome.');
  if (!clean(req.message) && !clean(req.subject)) problems.push('Conte o que você procura.');
  const email = clean(req.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push('Confira o e-mail digitado.');
  return problems;
}
