import Link from 'next/link';
import { Zap } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { tools, toolCategories, type ToolCategory } from '@/lib/tools-registry';

export function Footer() {
  const grouped = (Object.keys(toolCategories) as ToolCategory[]).map((cat) => ({
    label: toolCategories[cat],
    items: tools.filter((t) => t.category === cat),
  }));

  return (
    <footer className="mt-16 border-t bg-muted/20">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </span>
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Fast, free, browser-based developer micro-tools. No signup, no tracking of your data —
              everything runs locally in your browser.
            </p>
          </div>

          {grouped.map((g) => (
            <div key={g.label}>
              <p className="mb-2 text-sm font-semibold">{g.label}</p>
              <ul className="space-y-1.5 text-sm">
                {g.items.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/${t.slug}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link href="/sitemap.xml" className="hover:text-foreground">
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
