import Link from 'next/link';
import { ArrowRight, Lock, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tools, toolCategories, type ToolCategory } from '@/lib/tools-registry';
import { siteConfig } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: `${siteConfig.name} — Free Browser-Based Developer Tools`,
  description: siteConfig.description,
  path: '/',
});

export default function HomePage() {
  const grouped = (Object.keys(toolCategories) as ToolCategory[]).map((cat) => ({
    category: cat,
    label: toolCategories[cat],
    items: tools.filter((t) => t.category === cat),
  }));

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
        <div className="container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="default" className="mb-5">
              <Sparkles className="mr-1.5 h-3 w-3" />
              {tools.length} tools — all free, all browser-based
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              The fastest <span className="gradient-text">developer utilities</span>
              <br className="hidden md:block" /> on the web.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
              Format, validate, encode, decode, convert. Every tool runs in your browser — your data
              never leaves your machine.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/json-formatter"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Try JSON Formatter
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="#tools"
                className="inline-flex items-center gap-1.5 rounded-md border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Browse all tools
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Client-side only
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3 w-3" /> No signup
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Open architecture
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="container py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Every tool, one domain</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Bookmark once. Find what you need without the ad-laden detours.
          </p>
        </div>

        <div className="space-y-10">
          {grouped.map((g) => (
            <div key={g.category}>
              <div className="mb-3 flex items-end justify-between">
                <h3 className="text-lg font-semibold tracking-tight">{g.label}</h3>
                <span className="text-xs text-muted-foreground">
                  {g.items.filter((t) => t.status === 'live').length} of {g.items.length} live
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {g.items.map((tool) => {
                  const isLive = tool.status === 'live';
                  const Inner = (
                    <Card
                      className={
                        'h-full transition-all ' +
                        (isLive
                          ? 'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md'
                          : 'opacity-70')
                      }
                    >
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                            <tool.icon className="h-4 w-4" />
                          </span>
                          {isLive ? (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Badge variant="outline" className="text-[10px]">
                              Soon
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium">{tool.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {tool.tagline}
                        </p>
                      </CardContent>
                    </Card>
                  );
                  return isLive ? (
                    <Link key={tool.slug} href={`/${tool.slug}`} className="group">
                      {Inner}
                    </Link>
                  ) : (
                    <div key={tool.slug}>{Inner}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
