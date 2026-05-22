import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { tools } from '@/lib/tools-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
  // Only include live tools so search engines aren't pointed at empty pages.
  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.status === 'live')
    .map((t) => ({
      url: `${siteConfig.url}/${t.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  return [...staticRoutes, ...toolRoutes];
}
