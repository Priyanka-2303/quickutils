import { Mail } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/lib/site-config';

export const metadata = buildMetadata({
  title: 'Contact',
  description: `Get in touch with ${siteConfig.name}.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <article className="container max-w-2xl py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-3 text-muted-foreground">
        Bug reports, feature requests, or just want to say hi? We’d love to hear from you.
      </p>
      <div className="mt-8 inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono">hello@quickutils.dev</span>
      </div>
    </article>
  );
}
