import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';

type HeroProps = {
  tool: Tool;
  headline: string;
  subheadline: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Optional eyebrow text above the headline. */
  eyebrow?: string;
  className?: string;
};

export function Hero({
  tool,
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  eyebrow,
  className,
}: HeroProps) {
  return (
    <section className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />
      <div className="container relative py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <Badge variant="default" className="mb-4">
              <tool.icon className="mr-1.5 h-3 w-3" />
              {eyebrow}
            </Badge>
          )}
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {headline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            {subheadline}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-1.5 rounded-md border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
