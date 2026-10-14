import type { FloorQuote } from './floor-calculator';

const numberFormat = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatMeters(value: number): string {
  return numberFormat.format(value);
}

/** Monta o link wa.me com a mensagem já escrita. Aceita o número com ou sem máscara. */
export function buildWhatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    throw new Error('Número de WhatsApp inválido: use DDI + DDD + número.');
  }
  const text = message.trim();
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

export interface FloorQuoteMessageInput {
  quote: FloorQuote;
  lengthM: number;
  widthM: number;
  fallHeightM?: number;
}

export function buildFloorQuoteMessage({ quote, lengthM, widthM, fallHeightM }: FloorQuoteMessageInput): string {
  const lines = [
    `Olá, BERVEX! Quero um orçamento de piso para: ${quote.applicationLabel}.`,
    `Medidas: ${formatMeters(lengthM)} × ${formatMeters(widthM)} m = ${formatMeters(quote.areaM2)} m².`,
    `Com ${quote.marginPercent}% de margem: ${formatMeters(quote.areaWithMarginM2)} m².`,
  ];
  if (quote.plate && quote.plateCount !== null) {
    lines.push(`Indicação: ${quote.plateCount} placas de ${quote.plate.label}, espessura ${quote.thicknessLabel}.`);
  } else {
    lines.push(`Indicação: ${quote.thicknessLabel}.`);
  }
  if (quote.application === 'playground' && fallHeightM !== undefined) {
    lines.push(`Altura de queda do brinquedo: ${formatMeters(fallHeightM)} m.`);
  }
  lines.push('Cidade/UF: ');
  return lines.join('\n');
}

export interface ContactMessageInput {
  name: string;
  city: string;
  interest: string;
}

function buildContactIntro(name: string, city: string): string {
  if (name && city) return `Olá, BERVEX! Sou ${name}, de ${city}.`;
  if (name) return `Olá, BERVEX! Sou ${name}.`;
  if (city) return `Olá, BERVEX! Escrevo de ${city}.`;
  return 'Olá, BERVEX!';
}

export function buildContactMessage({ name, city, interest }: ContactMessageInput): string {
  const what = interest.trim() || 'pisos e equipamentos';
  return `${buildContactIntro(name.trim(), city.trim())} Quero um orçamento de ${what}.`;
}
