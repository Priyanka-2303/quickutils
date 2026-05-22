import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/lib/tools-registry';

export function RelatedTools({ tools, title = 'Related Tools' }: { tools: Tool[]; title?: string }) {
  if (tools.length === 0) return null;
  return (
    <section className="container py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            More browser-based utilities you might find useful.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group focus-visible:outline-none"
            aria-label={tool.name}
          >
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                    <tool.icon className="h-4 w-4" />
                  </span>
                  {tool.status === 'planned' ? (
                    <Badge variant="outline" className="text-[10px]">
                      Soon
                    </Badge>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  )}
                </div>
                <p className="font-medium leading-tight">{tool.shortName}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.tagline}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
