/** Schema.org JSON-LD graph builders (one @graph per page, nodes linked by @id). */
import { company } from '../data/company.ts';
import { founders, type Founder } from '../data/founders.ts';
import { pillars, type Pillar } from '../data/pillars.ts';
import type { Crumb } from '../data/pages.ts';
import { known } from './placeholder.ts';

type Node = Record<string, unknown>;

import { url } from './url.ts';

/** Absolute URL for a site path (adds the base path, e.g. /Tcan-Site on GitHub Pages). */
export const absolute = (site: URL | undefined, path: string) => new URL(url(path), site ?? 'https://www.tcan.com.br').href;

export const ids = (site: URL | undefined) => ({
  org: absolute(site, '/#organization'),
  website: absolute(site, '/#website'),
  person: (f: Founder) => absolute(site, `/sobre/#${f.id}`),
  service: (p: Pillar, s: Pillar['solutions'][number]) => absolute(site, `/solucoes/${p.slug}/#${s.anchor}`),
});

export function organization(site: URL | undefined): Node {
  const id = ids(site);
  const street = known(company.address.street);
  const city = known(company.address.city);
  const socials = Object.values(company.socials)
    .map((v) => known(v))
    .filter(Boolean);
  return {
    '@type': 'ProfessionalService',
    '@id': id.org,
    name: company.tradeName,
    alternateName: company.shortName,
    legalName: known(company.legalName),
    taxID: known(company.cnpj),
    url: absolute(site, '/'),
    logo: { '@type': 'ImageObject', url: absolute(site, '/brand/tcan-logo.png'), width: 674, height: 233 },
    image: absolute(site, '/og/home.png'),
    slogan: company.signature,
    description: company.description,
    email: known(company.email),
    address:
      street && city
        ? {
            '@type': 'PostalAddress',
            streetAddress: street,
            addressLocality: city,
            addressRegion: known(company.address.state),
            postalCode: known(company.address.postalCode),
            addressCountry: 'BR',
          }
        : undefined,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    knowsLanguage: 'pt-BR',
    founder: founders.map((f) => ({ '@id': id.person(f) })),
    contactPoint: founders.map((f) => ({
      '@type': 'ContactPoint',
      contactType: 'sales',
      name: f.name,
      telephone: `+${f.phoneE164}`,
      email: f.email,
      availableLanguage: ['pt-BR'],
      areaServed: 'BR',
    })),
    sameAs: socials.length ? socials : undefined,
    knowsAbout: pillars.flatMap((p) => p.solutions.map((s) => s.name)),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ecossistema de Soluções Empresariais',
      itemListElement: pillars.map((p) => ({
        '@type': 'OfferCatalog',
        name: p.name,
        url: absolute(site, `/solucoes/${p.slug}/`),
        itemListElement: p.solutions.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@id': id.service(p, s) },
        })),
      })),
    },
  };
}

export function website(site: URL | undefined): Node {
  const id = ids(site);
  return {
    '@type': 'WebSite',
    '@id': id.website,
    url: absolute(site, '/'),
    name: company.tradeName,
    inLanguage: 'pt-BR',
    publisher: { '@id': id.org },
  };
}

export function webPage(site: URL | undefined, path: string, title: string, description: string, crumbs?: Crumb[]): Node[] {
  const id = ids(site);
  const url = absolute(site, path);
  const nodes: Node[] = [
    {
      '@type': path === '/contato/' ? 'ContactPage' : path === '/sobre/' ? 'AboutPage' : 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': id.website },
      about: { '@id': id.org },
      breadcrumb: crumbs ? { '@id': `${url}#breadcrumb` } : undefined,
    },
  ];
  if (crumbs) {
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: absolute(site, c.path),
      })),
    });
  }
  return nodes;
}

export function persons(site: URL | undefined, image: Record<string, string> = {}): Node[] {
  const id = ids(site);
  return founders.map((f) => ({
    '@type': 'Person',
    '@id': id.person(f),
    name: f.name,
    jobTitle: f.role,
    description: f.bioShort,
    image: image[f.id],
    email: f.email,
    worksFor: { '@id': id.org },
    sameAs: [f.linkedin],
    alumniOf: f.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
  }));
}

export function services(site: URL | undefined, pillar: Pillar): Node[] {
  const id = ids(site);
  return pillar.solutions.map((s) => ({
    '@type': 'Service',
    '@id': id.service(pillar, s),
    name: s.name,
    serviceType: s.name,
    category: pillar.name,
    description: s.summary,
    provider: { '@id': id.org },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    url: absolute(site, `/solucoes/${pillar.slug}/#${s.anchor}`),
  }));
}

export function faqPage(site: URL | undefined, path: string, faq: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${absolute(site, path)}#faq`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** Drops undefined keys so the JSON stays clean. */
export const graph = (nodes: Node[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, (_k, v) => (v === undefined ? undefined : v));
