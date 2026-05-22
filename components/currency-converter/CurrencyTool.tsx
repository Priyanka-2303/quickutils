'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, RefreshCw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  fetchRates,
  convert,
  formatAmount,
  getCurrency,
  CURRENCIES,
  POPULAR_CURRENCIES,
  type RatesResponse,
  type CurrencyCode,
} from '@/lib/currency/logic';
import { cn } from '@/lib/utils';

/* ── Currency Combobox ───────────────────────────────────────────────────── */

function CurrencySelect({
  value,
  onChange,
}: {
  value: CurrencyCode;
  onChange: (v: CurrencyCode) => void;
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
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = getCurrency(value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setQuery(''); setOpen((o) => !o); }}
        className="flex h-14 w-full items-center gap-3 rounded-xl border bg-card px-4 text-left transition-colors hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className="text-2xl font-bold tabular-nums text-primary">{selected?.symbol}</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{selected?.name}</p>
        </div>
        <span className="text-muted-foreground">▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border bg-popover shadow-xl"
          >
            <div className="border-b p-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search currency…"
                className="h-8 w-full rounded-md bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <ul className="max-h-60 overflow-y-auto p-1">
              {filtered.map((c) => (
                <li key={c.code}>
                  <button
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent',
                      value === c.code && 'bg-primary/10 font-medium text-primary',
                    )}
                    onMouseDown={() => { onChange(c.code); setOpen(false); }}
                  >
                    <span className="w-6 text-center font-bold">{c.symbol}</span>
                    <span className="font-medium">{c.code}</span>
                    <span className="flex-1 truncate text-muted-foreground">{c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Tool ───────────────────────────────────────────────────────────── */

export function CurrencyTool() {
  const [amount, setAmount]   = useState('1');
  const [from, setFrom]       = useState<CurrencyCode>('USD');
  const [to, setTo]           = useState<CurrencyCode>('INR');
  const [rates, setRates]     = useState<RatesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const loadRates = useCallback(async (base: CurrencyCode) => {
    setLoading(true);
    setError(null);
    const data = await fetchRates(base);
    if (data) {
      setRates(data);
      setLastFetched(new Date().toLocaleTimeString());
    } else {
      setError('Could not fetch rates. Please check your connection and try again.');
    }
    setLoading(false);
  }, []);

  // Load rates when `from` changes
  useEffect(() => {
    loadRates(from);
  }, [from, loadRates]);

  const parsedAmount = parseFloat(amount) || 0;

  const result = useMemo(() => {
    if (!rates) return null;
    return convert(parsedAmount, from, to, rates);
  }, [parsedAmount, from, to, rates]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // Multi-currency board: popular currencies converted from `from`
  const board = useMemo(() => {
    if (!rates) return [];
    return POPULAR_CURRENCIES
      .filter((c) => c !== from)
      .map((code) => {
        const r = convert(parsedAmount, from, code, rates);
        return r ? { code, result: r.result, rate: r.rate } : null;
      })
      .filter(Boolean) as { code: string; result: number; rate: number }[];
  }, [rates, from, parsedAmount]);

  return (
    <div className="space-y-6">
      {/* Main converter */}
      <Card>
        <CardContent className="space-y-4 p-5">
          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
              step="any"
              className="h-12 w-full rounded-xl border bg-background px-4 text-xl font-semibold outline-none focus:ring-2 focus:ring-ring"
              placeholder="1"
            />
          </div>

          {/* From / Swap / To */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium">From</label>
              <CurrencySelect value={from} onChange={(v) => setFrom(v)} />
            </div>

            <div className="mt-6 shrink-0">
              <Button
                size="icon"
                variant="outline"
                onClick={swap}
                className="h-10 w-10 rounded-full"
                aria-label="Swap currencies"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium">To</label>
              <CurrencySelect value={to} onChange={(v) => setTo(v)} />
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl border bg-primary/5 p-4 text-center">
            {loading ? (
              <p className="animate-pulse text-muted-foreground">Fetching live rates…</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : result ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {formatAmount(parsedAmount, from)} =
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${result.result}-${to}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1 text-4xl font-bold tracking-tight text-primary"
                  >
                    {formatAmount(result.result, to)}
                  </motion.p>
                </AnimatePresence>
                <p className="mt-2 text-xs text-muted-foreground">
                  1 {from} = {result.rate.toFixed(4)} {to}
                </p>
              </>
            ) : null}
          </div>

          {/* Rate info bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {rates ? `ECB rates · ${rates.date}` : 'Loading…'}
            </span>
            <div className="flex items-center gap-2">
              {lastFetched && <span>Updated {lastFetched}</span>}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 gap-1 px-2 text-xs"
                onClick={() => loadRates(from)}
                disabled={loading}
              >
                <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-currency board */}
      {board.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold">
            {formatAmount(parsedAmount, from)} in other currencies
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {board.map(({ code, result: res }) => {
              const cur = getCurrency(code);
              const isTo = code === to;
              return (
                <button
                  key={code}
                  onClick={() => setTo(code)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5',
                    isTo && 'border-primary bg-primary/10',
                  )}
                >
                  <p className="text-xs font-medium text-muted-foreground">{code}</p>
                  <p className="mt-0.5 truncate font-semibold tabular-nums">
                    {cur?.symbol} {res.toLocaleString('en-US', {
                      minimumFractionDigits: code === 'JPY' || code === 'KRW' || code === 'IDR' ? 0 : 2,
                      maximumFractionDigits: code === 'JPY' || code === 'KRW' || code === 'IDR' ? 0 : 2,
                    })}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{cur?.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Rates from the European Central Bank via{' '}
        <a
          href="https://www.frankfurter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Frankfurter
        </a>
        . Updated every business day. Not for financial transactions.
      </p>
    </div>
  );
}
