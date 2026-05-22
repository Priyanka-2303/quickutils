'use client';

import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateGST, GST_RATES, GST_RATE_EXAMPLES, formatINR, type GSTRate, type GSTType, type CalcMode } from '@/lib/gst/logic';
import { copyToClipboard } from '@/lib/utils';

export function GSTTool() {
  const [amount, setAmount] = useState('10000');
  const [rate, setRate] = useState<GSTRate>(18);
  const [type, setType] = useState<GSTType>('intra');
  const [mode, setMode] = useState<CalcMode>('exclusive');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return null;
    return calculateGST(val, rate, type, mode);
  }, [amount, rate, type, mode]);

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      `GST Calculation Summary`,
      `─────────────────────────`,
      `Base Amount  : ${formatINR(result.baseAmount)}`,
      result.type === 'intra'
        ? `CGST (${rate / 2}%)   : ${formatINR(result.cgst)}\nSGST (${rate / 2}%)   : ${formatINR(result.sgst)}`
        : `IGST (${rate}%)   : ${formatINR(result.igst)}`,
      `GST Amount   : ${formatINR(result.gstAmount)}`,
      `Total Amount : ${formatINR(result.totalAmount)}`,
    ].join('\n');
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Inputs */}
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-5 p-4">
            <h3 className="font-semibold">Calculation Details</h3>

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Amount</label>
              <div className="flex h-10 items-center overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
                <span className="border-r bg-muted px-3 py-2 text-sm text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent px-3 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Mode toggle */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Amount type</label>
              <div className="flex overflow-hidden rounded-lg border text-sm">
                {[
                  { v: 'exclusive', label: 'Excl. GST', hint: 'Pre-tax amount' },
                  { v: 'inclusive', label: 'Incl. GST', hint: 'Total with tax' },
                ].map(({ v, label, hint }) => (
                  <button key={v} onClick={() => setMode(v as CalcMode)}
                    title={hint}
                    className={`flex-1 py-2 font-medium transition-colors ${mode === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {mode === 'exclusive' ? 'Calculate GST on top of this amount' : 'Extract GST from this total'}
              </p>
            </div>

            {/* GST Rate */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">GST Rate</label>
              <div className="grid grid-cols-5 gap-1.5">
                {GST_RATES.map((r) => (
                  <button key={r} onClick={() => setRate(r)}
                    className={`rounded-md border py-2 text-sm font-semibold transition-colors ${rate === r ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    {r}%
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">{GST_RATE_EXAMPLES[rate]}</p>
            </div>

            {/* Transaction type */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Transaction type</label>
              <div className="flex overflow-hidden rounded-lg border text-sm">
                <button onClick={() => setType('intra')}
                  className={`flex-1 py-2 font-medium transition-colors ${type === 'intra' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  Intra-state
                </button>
                <button onClick={() => setType('inter')}
                  className={`flex-1 py-2 font-medium transition-colors ${type === 'inter' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  Inter-state
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {type === 'intra' ? 'Splits into CGST + SGST (same state)' : 'Single IGST (different states)'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          {/* Summary card */}
          <Card className="overflow-hidden">
            <div className="bg-primary/5 px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {mode === 'exclusive' ? 'Total payable (incl. GST)' : 'GST amount extracted'}
                  </p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-primary">
                    {formatINR(mode === 'exclusive' ? result.totalAmount : result.gstAmount)}
                  </p>
                </div>
                <Button onClick={handleCopy} size="sm" variant="outline" className="gap-1.5 mt-1">
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            <CardContent className="divide-y p-4">
              {/* Base */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-muted-foreground">
                  Base amount ({mode === 'inclusive' ? 'extracted' : 'entered'})
                </span>
                <span className="font-semibold">{formatINR(result.baseAmount)}</span>
              </div>

              {/* GST split */}
              {result.type === 'intra' ? (
                <>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-muted-foreground">CGST @ {rate / 2}%</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">+ {formatINR(result.cgst)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-muted-foreground">SGST @ {rate / 2}%</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">+ {formatINR(result.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">IGST @ {rate}%</span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">+ {formatINR(result.igst)}</span>
                </div>
              )}

              {/* Total GST */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium">Total GST ({rate}%)</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">{formatINR(result.gstAmount)}</span>
              </div>

              {/* Grand total */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm font-bold">Grand total</span>
                <span className="text-lg font-bold text-primary">{formatINR(result.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Visual bar */}
          <Card>
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-medium">Breakdown</p>
              <div className="flex h-8 overflow-hidden rounded-lg">
                <div
                  className="flex items-center justify-center bg-primary text-xs font-medium text-primary-foreground transition-all"
                  style={{ width: `${(result.baseAmount / result.totalAmount) * 100}%` }}
                >
                  Base
                </div>
                <div
                  className="flex items-center justify-center bg-rose-400 text-xs font-medium text-white transition-all"
                  style={{ width: `${(result.gstAmount / result.totalAmount) * 100}%` }}
                >
                  {rate > 0 ? `GST ${rate}%` : ''}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatINR(result.baseAmount)}</span>
                <span>{formatINR(result.gstAmount)} GST</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick reference */}
          <Card>
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-semibold">All rates for {formatINR(parseFloat(amount) || 0)}</p>
              <div className="grid grid-cols-5 gap-2">
                {GST_RATES.map((r) => {
                  const q = calculateGST(parseFloat(amount) || 0, r, type, mode);
                  return (
                    <button key={r} onClick={() => setRate(r)}
                      className={`rounded-lg border p-2 text-center text-xs transition-colors hover:border-primary ${rate === r ? 'border-primary bg-primary/5' : ''}`}>
                      <p className="font-bold">{r}%</p>
                      <p className="mt-0.5 text-muted-foreground">{formatINR(q.gstAmount)}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid place-items-center rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground" style={{ minHeight: 280 }}>
          Enter an amount to see GST breakdown
        </div>
      )}
    </div>
  );
}
