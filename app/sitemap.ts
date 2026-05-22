import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { tools } from '@/lib/tools-registry';

/** Higher search volume → higher priority signal to Googlebot */
const HIGH_PRIORITY = new Set([
  'json-formatter', 'base64-encoder', 'compress-image',
  'image-to-pdf', 'pdf-merge', 'emi-calculator',
  'gst-calculator', 'salary-calculator', 'pdf-to-image',
  'currency-converter',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url,                    lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteConfig.url}/privacy`,       lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteConfig.url}/terms`,         lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteConfig.url}/contact`,       lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.status === 'live')
    .map((t) => ({
      url: `${siteConfig.url}/${t.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: HIGH_PRIORITY.has(t.slug) ? 0.9 : 0.75,
    }));
  return [...staticRoutes, ...toolRoutes];
}
