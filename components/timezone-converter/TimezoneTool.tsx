'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  POPULAR_TIMEZONES, getAllTimezones,
  formatInTZ, formatDateInTZ,
  getOffsetMinutes, offsetToString, getAbbr,
  getUserTZ,
} from '@/lib/timezone/logic';

const DEFAULT_ZONES = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

type TZRow = { tz: string; id: number };

let idSeq = 0;
const mkRow = (tz: string): TZRow => ({ tz, id: ++idSeq });

function TZCombobox({
  value, onChange, allZones,
}: {
  value: string; onChange: (v: string) => void; allZones: string[];
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return POPULAR_TIMEZONES.slice(0, 12);
    return allZones
      .filter((tz) => tz.toLowerCase().includes(q) ||
        POPULAR_TIMEZONES.find((p) => p.tz === tz)?.label.toLowerCase().includes(q))
      .slice(0, 20)
      .map((tz) => ({ tz, label: POPULAR_TIMEZONES.find((p) => p.tz === tz)?.label ?? tz.replace(/_/g, ' ') }));
  }, [query, allZones]);

  const displayLabel = POPULAR_TIMEZONES.find((p) => p.tz === value)?.label ?? value.replace(/_/g, ' ');

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <input
        value={open ? query : displayLabel}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { setQuery(''); setOpen(true); }}
        className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring truncate"
        placeholder="Search timezone…"
        aria-label="Select timezone"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border bg-popover shadow-lg"
          >
            {filtered.map((item) => (
              <li key={item.tz}>
                <button
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent ${value === item.tz ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  onMouseDown={() => { onChange(item.tz); setOpen(false); setQuery(''); }}
                >
                  <span className="flex-1 truncate">{item.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.tz.split('/')[0]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TimezoneTool() {
  const [rows, setRows] = useState<TZRow[]>(() => DEFAULT_ZONES.map(mkRow));
  const [now, setNow] = useState<Date>(() => new Date());
  const [pinned, setPinned] = useState<Date | null>(null);
  const [allZones] = useState<string[]>(() =>
    typeof window !== 'undefined' ? getAllTimezones() : POPULAR_TIMEZONES.map((p) => p.tz),
  );
  const [userTZ] = useState(() => typeof window !== 'undefined' ? getUserTZ() : 'UTC');

  // Live clock tick
  useEffect(() => {
    if (pinned) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [pinned]);

  const displayTime = pinned ?? now;

  const addRow = useCallback(() => {
    const used = new Set(rows.map((r) => r.tz));
    const next = POPULAR_TIMEZONES.find((p) => !used.has(p.tz));
    setRows((r) => [...r, mkRow(next?.tz ?? 'UTC')]);
  }, [rows]);

  const removeRow = useCallback((id: number) => {
    setRows((r) => r.filter((x) => x.id !== id));
  }, []);

  const updateRow = useCallback((id: number, tz: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, tz } : x)));
  }, []);

  const moveRow = useCallback((from: number, to: number) => {
    setRows((r) => {
      const arr = [...r];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }, []);

  // Time pin input (datetime-local)
  const pinnedInput = pinned
    ? `${pinned.getFullYear()}-${String(pinned.getMonth() + 1).padStart(2, '0')}-${String(pinned.getDate()).padStart(2, '0')}T${String(pinned.getHours()).padStart(2, '0')}:${String(pinned.getMinutes()).padStart(2, '0')}`
    : '';

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Convert time:</label>
          <input
            type="datetime-local"
            value={pinnedInput}
            onChange={(e) => setPinned(e.target.value ? new Date(e.target.value) : null)}
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {pinned && (
            <Button onClick={() => setPinned(null)} size="sm" variant="ghost" className="gap-1.5">
              Use live time
            </Button>
          )}
        </div>
        {!pinned && (
          <Badge variant="success" className="gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Your timezone: <strong>{userTZ}</strong></span>
          <Button onClick={addRow} size="sm" variant="secondary" className="gap-1.5" disabled={rows.length >= 10}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>

      {/* Timezone rows */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {rows.map((row, i) => {
            const offsetMin = getOffsetMinutes(row.tz, displayTime);
            const abbr      = getAbbr(row.tz, displayTime);
            const offset    = offsetToString(offsetMin);
            const timeStr   = formatInTZ(displayTime, row.tz);
            const dateStr   = formatDateInTZ(displayTime, row.tz);
            const isUser    = row.tz === userTZ;

            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`group flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm transition-colors hover:border-primary/40 sm:flex-row sm:items-center ${isUser ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                {/* Drag handle + order */}
                <div className="flex items-center gap-2 sm:w-6">
                  <span className="text-xs text-muted-foreground/50 tabular-nums">{i + 1}</span>
                </div>

                {/* Timezone picker */}
                <TZCombobox value={row.tz} onChange={(v) => updateRow(row.id, v)} allZones={allZones} />

                {/* Time display */}
                <div className="flex items-center gap-3 sm:ml-auto sm:text-right">
                  <div>
                    <p className="font-mono text-xl font-bold tabular-nums leading-none">{timeStr}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{dateStr}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="text-[10px]">{abbr}</Badge>
                    <span className="text-[10px] text-muted-foreground">{offset}</span>
                  </div>
                  {isUser && <Badge variant="default" className="text-[10px]">You</Badge>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {i > 0 && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveRow(i, i - 1)} aria-label="Move up">
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeRow(row.id)} aria-label="Remove timezone" disabled={rows.length <= 1}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* DST notice */}
      <p className="text-center text-xs text-muted-foreground">
        Offsets update automatically for Daylight Saving Time. All calculations use your browser&apos;s Intl API.
      </p>
    </div>
  );
}
