import type { Founder } from '../data/founders.ts';

export const waLink = (phoneE164: string, message?: string) =>
  `https://wa.me/${phoneE164}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const mailLink = (email: string, subject?: string, body?: string) => {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${parts.length ? `?${parts.join('&')}` : ''}`;
};

export const founderWa = (founder: Founder, topic?: string) =>
  waLink(
    founder.phoneE164,
    topic
      ? `Olá, ${founder.firstName}! Vim pelo site da TCAN e quero conversar sobre ${topic}.`
      : `Olá, ${founder.firstName}! Vim pelo site da TCAN e quero conversar sobre um desafio da minha empresa.`,
  );

export const telLink = (phoneE164: string) => `tel:+${phoneE164}`;
