import { AdSlot } from './AdSlot';

export function SidebarAd({ slot, className }: { slot?: string; className?: string }) {
  return (
    <div className={className}>
      <AdSlot
        slot={slot}
        format="vertical"
        reservedHeight={600}
        reservedWidth={300}
        label="Sponsored"
      />
    </div>
  );
}
