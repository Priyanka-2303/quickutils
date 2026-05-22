'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  buildGrid,
  getBestSlots,
  getAcceptableSlots,
  mkZone,
  DEFAULT_MEETING_ZONES,
  POPULAR_TIMEZONES,
  type MeetingZone,
  type ZoneRow,
} from '@/lib/meeting/logic';
import { getAllTimezones } from '@/lib/timezone/logic';
import { cn } from '@/lib/utils';

/* ─── Timezone Combobox ─────────────────────────────────────────────────── */

function TZCombobox({
  value,
  onChange,
  allZones,
}: {
  value: string;
  onChange: (v: string) => void;
  allZones: string[];
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return POPULAR_TIMEZONES.slice(0, 12);
    return allZones
      .filter(
        (tz) =>
          tz.toLowerCase().includes(q) ||
          POPULAR_TIMEZONES.find((p) => p.tz === tz)?.label.toLowerCase().includes(q),
      )
      .slice(0, 20)
      .map((tz) => ({
        tz,
        label: POPULAR_TIMEZONES.find((p) => p.tz === tz)?.label ?? tz.replace(/_/g, ' '),
      }));
  }, [query, allZones]);

  const displayLabel =
    POPULAR_TIMEZONES.find((p) => p.tz === value)?.label ?? value.replace(/_/g, ' ');

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <input
        value={open ? query : displayLabel}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { setQuery(''); setOpen(true); }}
        className="h-8 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        placeholder="Search timezone…"
        aria-label="Select timezone"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1 max-h-52 w-64 overflow-y-auto rounded-lg border bg-popover shadow-lg"
          >
            {filtered.map((item) => (
              <li key={item.tz}>
                <button
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent',
                    value === item.tz && 'bg-primary/10 font-medium text-primary',
                  )}
                  onMouseDown={() => { onChange(item.tz); setOpen(false); setQuery(''); }}
                >
                  <span className="flex-1 truncate">{item.label}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {item.tz.split('/')[0]}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Slot cell ─────────────────────────────────────────────────────────── */

function SlotCell({
  slot,
  isBest,
  isAcceptable,
  isSelected,
  onClick,
}: {
  slot: ZoneRow['slots'][number];
  isBest: boolean;
  isAcceptable: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={`${slot.localTime} ${slot.abbr} (${slot.offset})`}
      className={cn(
        'relative flex min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 py-2 text-center transition-all',
        'hover:border-primary/60 hover:bg-primary/5',
        isBest && 'border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/30',
        isAcceptable && !isBest && 'border-amber-300/60 bg-amber-50 dark:bg-amber-950/20',
        slot.isNight && !isBest && !isAcceptable && 'border-transparent bg-muted/50 opacity-50',
        isSelected && 'ring-2 ring-primary',
      )}
      aria-pressed={isSelected}
    >
      <span className="text-[10px] font-mono font-semibold tabular-nums leading-none">
        {slot.localTime.replace(':00', '').replace(' ', ' ')}
      </span>
      {slot.dayOffset !== 0 && (
        <span className="text-[8px] text-muted-foreground leading-none">
          {slot.dayOffset > 0 ? '+1d' : '-1d'}
        </span>
      )}
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function MeetingTool() {
  const [zones, setZones]           = useState<MeetingZone[]>(DEFAULT_MEETING_ZONES);
  const [date, setDate]             = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedHour, setSelected] = useState<number | null>(null);
  const [allZones] = useState<string[]>(() =>
    typeof window !== 'undefined' ? getAllTimezones() : POPULAR_TIMEZONES.map((p) => p.tz),
  );

  const parsedDate = useMemo(() => new Date(date + 'T00:00:00'), [date]);

  const grid = useMemo(() => buildGrid(parsedDate, zones), [parsedDate, zones]);

  const bestSlots       = useMemo(() => getBestSlots(grid), [grid]);
  const acceptableSlots = useMemo(() => getAcceptableSlots(grid), [grid]);

  const addZone = useCallback(() => {
    const used = new Set(zones.map((z) => z.tz));
    const next = POPULAR_TIMEZONES.find((p) => !used.has(p.tz));
    setZones((z) => [...z, mkZone(next?.tz ?? 'UTC')]);
  }, [zones]);

  const removeZone = useCallback((id: number) => {
    setZones((z) => z.filter((x) => x.id !== id));
  }, []);

  const updateZone = useCallback((id: number, tz: string) => {
    setZones((z) =>
      z.map((x) =>
        x.id === id ? { ...x, tz, label: POPULAR_TIMEZONES.find((p) => p.tz === tz)?.label ?? tz.replace(/_/g, ' ') } : x,
      ),
    );
  }, []);

  // Scroll container ref for horizontal scrolling grid
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-5">
      {/* Controls */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded border border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/30" />
              Best (all in business hours)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded border border-amber-300/60 bg-amber-50 dark:bg-amber-950/20" />
              OK (no one sleeping)
            </span>
            <span className="flex items-center gap-1 opacity-50">
              <span className="inline-block h-3 w-3 rounded border bg-muted/50" />
              Night
            </span>
          </div>

          <div className="ml-auto flex gap-2">
            <Button
              onClick={addZone}
              size="sm"
              variant="secondary"
              className="gap-1.5"
              disabled={zones.length >= 8}
            >
              <Plus className="h-3.5 w-3.5" /> Add timezone
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Best slot summary */}
      {bestSlots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-50 px-4 py-2.5 text-sm dark:bg-emerald-950/30"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="font-medium text-emerald-800 dark:text-emerald-300">
            Best overlap:
          </span>
          {bestSlots.map((h) => (
            <Badge
              key={h}
              variant="secondary"
              className="cursor-pointer border-emerald-400/40 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200"
              onClick={() => setSelected(h === selectedHour ? null : h)}
            >
              {String(h).padStart(2, '0')}:00 UTC
            </Badge>
          ))}
        </motion.div>
      )}

      {bestSlots.length === 0 && acceptableSlots.length === 0 && zones.length >= 2 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <Moon className="h-4 w-4 shrink-0" />
          No overlap found — someone is always asleep. Try a different date or adjust timezones.
        </div>
      )}

      {/* Zone rows */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {zones.map((zone) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-3">
                  {/* Zone header */}
                  <div className="mb-2 flex items-center gap-2">
                    <TZCombobox
                      value={zone.tz}
                      onChange={(v) => updateZone(zone.id, v)}
                      allZones={allZones}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0 text-destructive"
                      onClick={() => removeZone(zone.id)}
                      disabled={zones.length <= 2}
                      aria-label="Remove timezone"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Slot grid — horizontally scrollable */}
                  <div ref={scrollRef} className="overflow-x-auto pb-1">
                    <div className="flex gap-1" style={{ minWidth: 'max-content' }}>
                      {grid
                        .find((r) => r.tz === zone.tz)
                        ?.slots.map((slot) => {
                          const isBest       = bestSlots.includes(slot.utcHour);
                          const isAcceptable = acceptableSlots.includes(slot.utcHour);
                          const isSelected   = selectedHour === slot.utcHour;
                          return (
                            <SlotCell
                              key={slot.utcHour}
                              slot={slot}
                              isBest={isBest}
                              isAcceptable={isAcceptable}
                              isSelected={isSelected}
                              onClick={() =>
                                setSelected(slot.utcHour === selectedHour ? null : slot.utcHour)
                              }
                            />
                          );
                        })}
                    </div>
                  </div>

                  {/* Selected slot detail */}
                  {selectedHour !== null && (() => {
                    const s = grid.find((r) => r.tz === zone.tz)?.slots[selectedHour];
                    if (!s) return null;
                    return (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Selected:{' '}
                        <strong className="text-foreground">
                          {s.localTime} {s.abbr}
                        </strong>{' '}
                        — {s.localDate}{' '}
                        {s.dayOffset !== 0 && (
                          <span className="text-amber-600">
                            ({s.dayOffset > 0 ? 'next day' : 'previous day'})
                          </span>
                        )}
                      </p>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hour labels */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 pb-1" style={{ minWidth: 'max-content' }}>
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              className={cn(
                'flex min-w-[56px] items-center justify-center text-[9px] tabular-nums text-muted-foreground',
                bestSlots.includes(h) && 'font-bold text-emerald-600',
                acceptableSlots.includes(h) && !bestSlots.includes(h) && 'text-amber-600',
              )}
            >
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <Sun className="mr-1 inline h-3 w-3" />
        Business hours 09:00–18:00 local.{' '}
        <Moon className="mr-1 inline h-3 w-3" />
        Night 21:00–06:00 local. All offsets use live DST rules.
      </p>
    </div>
  );
}
