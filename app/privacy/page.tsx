import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name} — what we collect, what we don't, and how your data is handled.`,
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <article className="container max-w-3xl py-12 prose-quickutils">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-5 text-[15px] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold">Tool data</h2>
          <p>
            All utilities on {siteConfig.name} run entirely in your browser. The text, files, and
            inputs you provide to a tool are processed locally with JavaScript and are never
            transmitted to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Analytics</h2>
          <p>
            We use privacy-respecting analytics (Google Analytics 4 with IP anonymization, and
            Microsoft Clarity) to understand which tools are used and to fix usability problems. No
            personally identifiable information is collected by us, and tool inputs are never sent
            to analytics services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Advertising</h2>
          <p>
            We display ads via Google AdSense to keep the site free. AdSense may set cookies to show
            relevant ads. You can manage ad personalisation at{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              adssettings.google.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            Questions about this policy? Reach us via the{' '}
            <a href="/contact" className="text-primary underline-offset-4 hover:underline">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
