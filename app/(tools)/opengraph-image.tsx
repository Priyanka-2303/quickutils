import { siteConfig } from '@/lib/site-config';
import { createOgImageResponse, OG_SIZE } from '@/lib/og/brand';

export const runtime = 'edge';
export const alt = `${siteConfig.name} — Free Online Tools`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return createOgImageResponse(
    siteConfig.name,
    'Free online tools — JSON, PDF, finance, images & more',
  );
}
