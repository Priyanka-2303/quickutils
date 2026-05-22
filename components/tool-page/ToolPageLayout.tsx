import type { ReactNode } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  breadcrumbSchema,
  softwareAppSchema,
  webPageSchema,
  howToSchema,
  defaultHowToSteps,
  type HowToStep,
} from '@/lib/seo/jsonld';
import { siteConfig } from '@/lib/site-config';
import type { Tool } from '@/lib/tools-registry';
import { Hero } from './Hero';
import { RelatedTools } from './RelatedTools';
import { FaqSection } from './FaqSection';
import { ContentSection } from './ContentSection';
import { BannerAd } from '@/components/ads/BannerAd';
import type { FAQ } from '@/lib/seo/jsonld';

type ContentBlock = {
  title: string;
  description?: string;
  body: ReactNode;
};

type ToolPageLayoutProps = {
  tool: Tool;
  hero: {
    headline: string;
    subheadline: string;
    eyebrow?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  /** The interactive tool itself — rendered immediately under the hero. */
  children: ReactNode;
  contentBlocks?: ContentBlock[];
  faqs?: FAQ[];
  relatedTools: Tool[];
  /** Custom HowTo steps. Defaults to a 3-step generic guide if omitted. */
  howToSteps?: HowToStep[];
  /** Set to false to hide the in-page banner ad below the tool. */
  showBannerAd?: boolean;
};

/**
 * Single layout used by every utility page on the platform.
 * Auto-emits: SoftwareApplication, BreadcrumbList, WebPage, HowTo JSON-LD.
 */
export function ToolPageLayout({
  tool,
  hero,
  children,
  contentBlocks = [],
  faqs = [],
  relatedTools,
  howToSteps,
  showBannerAd = true,
}: ToolPageLayoutProps) {
  const url = `${siteConfig.url}/${tool.slug}`;
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: tool.name, url },
  ];
  const steps = howToSteps ?? defaultHowToSteps(tool.name);

  return (
    <>
      <JsonLd
        data={[
          softwareAppSchema({
            name: tool.name,
            description: tool.description,
            url,
            keywords: tool.related,
          }),
          webPageSchema({
            name: tool.name,
            description: tool.description,
            url,
            breadcrumb: breadcrumbs,
          }),
          breadcrumbSchema(breadcrumbs),
          howToSchema({
            name: `How to use ${tool.name}`,
            description: tool.tagline,
            steps,
            totalTime: 'PT1M',
          }),
        ]}
      />

      <Hero tool={tool} {...hero} />

      <section className="container py-8">{children}</section>

      {showBannerAd && (
        <div className="container my-6">
          <BannerAd />
        </div>
      )}

      {contentBlocks.map((block) => (
        <ContentSection key={block.title} title={block.title} description={block.description}>
          {block.body}
        </ContentSection>
      ))}

      {faqs.length > 0 && <FaqSection faqs={faqs} />}

      <RelatedTools tools={relatedTools} />
    </>
  );
}
