'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AdSlot } from './AdSlot';

/**
 * Sticky mobile-only ad. Dismissable.
 * Hidden on md+ to avoid covering desktop content.
 */
export function MobileStickyAd({ slot }: { slot?: string }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-3 py-2 backdrop-blur md:hidden">
      <button
        type="button"
        aria-label="Dismiss ad"
        onClick={() => setHidden(true)}
        className="absolute -top-3 right-2 grid h-6 w-6 place-items-center rounded-full border bg-background shadow-sm"
      >
        <X className="h-3 w-3" />
      </button>
      <AdSlot slot={slot} format="horizontal" reservedHeight={60} />
    </div>
  );
}
