import { siteConfig } from '@/lib/site-config';

export type FAQ = { question: string; answer: string };
export type HowToStep = { name: string; text: string };

/* ── Organisation & Website ─────────────────────────────────────────────── */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/apple-icon`,
      width: 180,
      height: 180,
    },
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/* ── SoftwareApplication (per-tool page) ────────────────────────────────── */

export function softwareAppSchema(opts: {
  name: string;
  description: string;
  url: string;
  category?: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: opts.category ?? 'DeveloperApplication',
    applicationSubCategory: 'Utility',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript',
    permissions: 'none',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    keywords: opts.keywords?.join(', '),
  };
}

/* ── WebPage (per-tool page) ─────────────────────────────────────────────── */

export function webPageSchema(opts: {
  name: string;
  description: string;
  url: string;
  breadcrumb: Array<{ name: string; url: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: { '@type': 'WebSite', url: siteConfig.url, name: siteConfig.name },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: opts.breadcrumb.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    },
    inLanguage: 'en',
    isAccessibleForFree: true,
  };
}

/* ── HowTo (per-tool page → step-by-step rich results) ──────────────────── */

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration e.g. "PT1M"
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    totalTime: opts.totalTime ?? 'PT1M',
    tool: [{ '@type': 'HowToTool', name: 'Web Browser' }],
    supply: [],
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${siteConfig.url}#step${i + 1}`,
    })),
  };
}

/** Default 3-step HowTo for any tool — used when a page doesn't supply custom steps */
export function defaultHowToSteps(toolName: string): HowToStep[] {
  return [
    {
      name: 'Open the tool',
      text: `Go to ${toolName} on QuickUtils. No installation, no signup, and no data is ever uploaded to a server.`,
    },
    {
      name: 'Paste or enter your input',
      text: `Type or paste your input directly into the tool. Results appear instantly as you type — all processing happens locally in your browser.`,
    },
    {
      name: 'Copy or download the result',
      text: `Copy the output to your clipboard with one click, or download it as a file. Your data stays private on your device throughout.`,
    },
  ];
}

/* ── ItemList (homepage tool directory) ─────────────────────────────────── */

export function itemListSchema(items: Array<{ name: string; url: string; description: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${siteConfig.name} — Free Online Tools`,
    description: siteConfig.description,
    url: siteConfig.url,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  };
}

/* ── FAQPage ─────────────────────────────────────────────────────────────── */

export function faqSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/* ── BreadcrumbList ──────────────────────────────────────────────────────── */

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
