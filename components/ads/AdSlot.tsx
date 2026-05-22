'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Generic ad slot.
 * - Reserves layout space to avoid Cumulative Layout Shift (CLS).
 * - Renders the AdSense unit only when the slot enters the viewport (lazy).
 * - Falls back to a neutral placeholder when AdSense is not configured —
 *   useful in dev and before approval.
 *
 * Wire AdSense by setting NEXT_PUBLIC_ADSENSE_CLIENT and passing `slot`.
 * Ad units must be created in your AdSense dashboard first.
 */
export type AdSlotProps = {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  /** Reserved height in px to prevent layout shift before the ad loads. */
  reservedHeight: number;
  /** Optional reserved width. Falls back to 100%. */
  reservedWidth?: number;
  className?: string;
  label?: string;
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function AdSlot({
  slot,
  format = 'auto',
  reservedHeight,
  reservedWidth,
  className,
  label = 'Advertisement',
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !adsenseClient || !slot) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // ignore — AdSense errors are non-fatal
    }
  }, [visible, slot]);

  const isConfigured = Boolean(adsenseClient && slot);

  return (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ minHeight: reservedHeight, maxWidth: reservedWidth ?? undefined }}
      role="complementary"
      aria-label={label}
    >
      <span className="absolute -top-4 right-0 text-[10px] uppercase tracking-wider text-muted-foreground/60">
        {label}
      </span>

      {isConfigured && visible ? (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block', minHeight: reservedHeight }}
          data-ad-client={adsenseClient}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-xs text-muted-foreground"
          style={{ minHeight: reservedHeight }}
        >
          {isConfigured ? 'Loading ad…' : 'Ad slot'}
        </div>
      )}
    </div>
  );
}
