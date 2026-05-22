import { AdSlot } from './AdSlot';

export function BannerAd({ slot, className }: { slot?: string; className?: string }) {
  return (
    <AdSlot
      slot={slot}
      format="horizontal"
      reservedHeight={100}
      className={className}
      label="Sponsored"
    />
  );
}
