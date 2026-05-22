'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Link, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTimeLeft, PRESETS, toLocalDatetimeInput, type TimeLeft } from '@/lib/countdown/logic';
import { copyToClipboard } from '@/lib/utils';

const DEFAULT_TITLE  = 'My Countdown';
const DEFAULT_TARGET = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  d.setHours(0, 0, 0, 0);
  return d;
})();

function Digit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border bg-card shadow-sm md:h-24 md:w-24">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="font-mono text-3xl font-bold tabular-nums md:text-4xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function CountdownTool() {
  const [title, setTitle]   = useState(DEFAULT_TITLE);
  const [target, setTarget] = useState<Date>(DEFAULT_TARGET);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(DEFAULT_TARGET));
  const [copied, setCopied] = useState(false);

  // Read from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t');
    const n = params.get('n');
    if (t) {
      const d = new Date(Number(t));
      if (!isNaN(d.getTime())) setTarget(d);
    }
    if (n) setTitle(decodeURIComponent(n));
  }, []);

  // Tick every second
  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const applyPreset = useCallback((getDate: () => Date) => {
    const d = getDate();
    setTarget(d);
  }, []);

  const handleDateChange = (v: string) => {
    if (!v) return;
    const d = new Date(v);
    if (!isNaN(d.getTime())) setTarget(d);
  };

  const shareLink = useCallback(async () => {
    const url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('t', String(target.getTime()));
    url.searchParams.set('n', encodeURIComponent(title));
    const ok = await copyToClipboard(url.toString());
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }, [target, title]);

  const progress = (() => {
    if (timeLeft.isPast) return 100;
    const total = target.getTime() - Date.now() + timeLeft.total;
    return total > 0 ? Math.min(100, Math.round(((total - timeLeft.total) / total) * 100)) : 0;
  })();

  return (
    <div className="space-y-6">
      {/* Countdown display */}
      <Card className="overflow-hidden">
        <div className="bg-primary/5 px-5 py-6 text-center">
          {title && (
            <p className="mb-4 text-sm font-medium text-muted-foreground">{title}</p>
          )}

          {timeLeft.isPast ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-4 text-center"
            >
              <p className="text-4xl font-bold text-primary">🎉 Time&apos;s up!</p>
              <p className="mt-2 text-muted-foreground">The countdown has ended.</p>
            </motion.div>
          ) : (
            <div className="flex flex-wrap items-end justify-center gap-3 md:gap-5">
              {timeLeft.days > 0 && <Digit value={timeLeft.days} label="Days" />}
              <Digit value={timeLeft.hours} label="Hours" />
              <Digit value={timeLeft.minutes} label="Min" />
              <Digit value={timeLeft.seconds} label="Sec" />
            </div>
          )}

          {/* Target date */}
          {!timeLeft.isPast && (
            <p className="mt-4 text-xs text-muted-foreground">
              {target.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        <CardContent className="flex flex-wrap items-center gap-3 p-3">
          <Button onClick={shareLink} size="sm" variant="outline" className="gap-1.5">
            {copied ? <><Copy className="h-3.5 w-3.5" /> Copied!</> : <><Link className="h-3.5 w-3.5" /> Share link</>}
          </Button>
          <Badge variant="secondary" className="text-[10px]">
            {timeLeft.total > 0
              ? `${Math.round(timeLeft.total / 1000).toLocaleString()} seconds remaining`
              : 'Ended'}
          </Badge>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-4">
            <h3 className="font-semibold">Countdown Settings</h3>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Countdown"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                maxLength={60}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Target date & time</label>
              <input
                type="datetime-local"
                value={toLocalDatetimeInput(target)}
                onChange={(e) => handleDateChange(e.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button
              onClick={() => {
                setTarget(DEFAULT_TARGET);
                setTitle(DEFAULT_TITLE);
              }}
              size="sm" variant="ghost" className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 font-semibold">Quick presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { applyPreset(p.getDate); setTitle(p.label); }}
                  className="rounded-lg border bg-muted/30 px-3 py-2 text-left text-xs font-medium hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Use <strong>Share link</strong> to bookmark or send this countdown — the target date is saved in the URL.
      </p>
    </div>
  );
}
