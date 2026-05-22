'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema, type FAQ } from '@/lib/seo/jsonld';
import { cn } from '@/lib/utils';

/**
 * Accessible FAQ accordion that also emits FAQPage JSON-LD for rich results.
 * Pass the same FAQ list once — the component handles both UI and schema.
 */
export function FaqSection({
  faqs,
  title = 'Frequently asked questions',
  description,
}: {
  faqs: FAQ[];
  title?: string;
  description?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="container py-12">
      <JsonLd data={faqSchema(faqs)} />
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="divide-y rounded-xl border bg-card">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 pt-0 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
