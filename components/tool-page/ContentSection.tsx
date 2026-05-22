import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Long-form SEO content slot. Use for "What is X?", "How to use", "Benefits" sections.
 * Renders prose with sensible typography defaults — pass children as semantic HTML.
 */
export function ContentSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('container py-10', className)}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/90 [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </section>
  );
}
