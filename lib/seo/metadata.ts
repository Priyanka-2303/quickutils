import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
};

/**
 * Single source of truth for page metadata.
 * Every page should call this so tags stay consistent.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  keywords,
  noindex,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const fullTitle =
    title === siteConfig.name ? title : `${title} — ${siteConfig.name}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    authors: [{ name: siteConfig.author }],
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      site: siteConfig.twitterHandle,
    },
  };
}
