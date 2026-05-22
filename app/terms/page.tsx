import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.name}.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <article className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-5 text-[15px] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">Use of the service</h2>
          <p>
            {siteConfig.name} provides free, browser-based utilities. The tools are offered “as is”
            without warranty of any kind. By using the site, you agree not to use the service for
            unlawful purposes or in any manner that could damage or impair it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">No liability</h2>
          <p>
            We are not liable for any data loss, damages, or losses arising from the use of these
            tools. Always keep backups of important data and verify outputs before using them in
            production.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changes</h2>
          <p>We may update these terms from time to time. Continued use constitutes acceptance.</p>
        </section>
      </div>
    </article>
  );
}
