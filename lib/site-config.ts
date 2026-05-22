export const siteConfig = {
  name: 'QuickUtils',
  shortName: 'QuickUtils',
  description:
    'Fast, free, browser-based developer micro-tools. Format JSON, validate, minify, encode, decode — all client-side, no signup required.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quickutils.dev',
  ogImage: '/og-default.png',
  author: 'QuickUtils',
  twitterHandle: '@quickutils',
  keywords: [
    'developer tools',
    'online utilities',
    'JSON formatter',
    'JSON validator',
    'free dev tools',
    'browser tools',
  ],
  navigation: [
    { label: 'JSON Formatter', href: '/json-formatter' },
    { label: 'All Tools', href: '/#tools' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
