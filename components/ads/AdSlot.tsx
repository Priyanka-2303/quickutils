'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type AdSlotProps = {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  reservedHeight: number;
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
  const insRef = useRef<HTMLModElement>(null);
  const [visible, setVisible]   = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  // Lazy-load: only push AdSense when slot scrolls into view
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
      // non-fatal
    }
  }, [visible, slot]);

  // Watch the <ins> for AdSense filling it — hide the white box until then
  useEffect(() => {
    if (!insRef.current) return;
    const obs = new MutationObserver(() => {
      const ins = insRef.current;
      if (!ins) return;
      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled') setAdLoaded(true);
      if (status === 'unfilled') setAdLoaded(false);
    });
    obs.observe(insRef.current, { attributes: true, attributeFilter: ['data-ad-status'] });
    return () => obs.disconnect();
  }, [visible]);

  const isConfigured = Boolean(adsenseClient && slot);

  if (!isConfigured) return null;

  return (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ maxWidth: reservedWidth ?? undefined }}
      role="complementary"
      aria-label={label}
    >
      {adLoaded && (
        <span className="absolute -top-4 right-0 text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {label}
        </span>
      )}

      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{
          display: 'block',
          minHeight: adLoaded ? reservedHeight : 0,
          overflow: 'hidden',
        }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
