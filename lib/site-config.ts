export const siteConfig = {
  name: 'QuickUtils',
  shortName: 'QuickUtils',
  description:
    'Free online developer tools, calculators and converters — all running in your browser. Format JSON, encode Base64, decode JWT, test regex, calculate GST, EMI, salary, compress images, merge PDFs and more. No signup, no data uploads.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quick-utils.dev',
  author: 'QuickUtils',
  twitterHandle: '@quickutils',
  keywords: [
    // Brand
    'QuickUtils',
    'quick utils',
    // Category
    'free online developer tools',
    'free online tools',
    'browser based tools',
    'client side tools',
    'online utilities',
    'web developer utilities',
    // Developer
    'json formatter online',
    'json validator',
    'base64 encoder decoder',
    'jwt decoder online',
    'regex tester online',
    'uuid generator',
    // Finance (India)
    'gst calculator india',
    'emi calculator',
    'salary calculator india',
    'take home salary calculator',
    // Time
    'timezone converter',
    'countdown timer',
    'meeting planner',
    // Image / PDF
    'compress image online',
    'image to pdf converter',
    'pdf merge online',
    'pdf to image converter',
    // Generic
    'no signup tools',
    'privacy friendly tools',
    'free calculators online',
  ],
  navigation: [
    { label: 'JSON Formatter', href: '/json-formatter' },
    { label: 'All Tools', href: '/#tools' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
