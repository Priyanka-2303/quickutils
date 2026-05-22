'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateEMI, LOAN_PRESETS, formatINR, formatINRCompact, type LoanPreset } from '@/lib/emi/logic';

type View = 'summary' | 'schedule';

function SliderInput({
  label, value, onChange, min, max, step = 1, display, hint,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; display: string; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-semibold text-primary">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min.toLocaleString('en-IN')}</span>
        <span>{max.toLocaleString('en-IN')}</span>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function MiniBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function EMITool() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [view, setView] = useState<View>('summary');
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const result = useMemo(
    () => calculateEMI({ principal, annualRate: rate, tenureMonths: tenureYears * 12 }),
    [principal, rate, tenureYears],
  );

  const applyPreset = (preset: LoanPreset) => {
    setPrincipal(preset.principal);
    setRate(preset.rate);
    setTenureYears(preset.tenureYears);
  };

  const visibleRows = result
    ? showFullSchedule
      ? result.schedule
      : result.schedule.slice(0, 24)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* Inputs */}
      <div className="space-y-4">
        {/* Presets */}
        <div className="grid grid-cols-2 gap-2">
          {LOAN_PRESETS.map((p) => (
            <button key={p.type} onClick={() => applyPreset(p)}
              className="rounded-lg border bg-card px-3 py-2 text-left text-xs hover:border-primary hover:bg-primary/5 transition-colors">
              <p className="font-semibold">{p.label}</p>
              <p className="text-muted-foreground">{formatINRCompact(p.principal)} · {p.rate}% · {p.tenureYears}yr</p>
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-5 p-4">
            <h3 className="font-semibold">Loan Details</h3>

            <SliderInput
              label="Loan amount" value={principal}
              onChange={setPrincipal} min={100000} max={50000000} step={100000}
              display={formatINRCompact(principal)}
            />
            <SliderInput
              label="Interest rate (per annum)" value={rate}
              onChange={setRate} min={5} max={24} step={0.1}
              display={`${rate.toFixed(1)}%`}
            />
            <SliderInput
              label="Loan tenure" value={tenureYears}
              onChange={setTenureYears} min={1} max={30} step={1}
              display={`${tenureYears} yr`}
              hint={`${tenureYears * 12} months`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          {/* Hero card */}
          <Card className="overflow-hidden">
            <div className="bg-primary/5 px-5 py-4">
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-primary">
                {formatINR(result.emi)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                for {tenureYears} years ({tenureYears * 12} months)
              </p>
            </div>
            <CardContent className="p-4">
              <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border bg-muted/20 p-2">
                  <p className="text-[11px] text-muted-foreground">Principal</p>
                  <p className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">{formatINRCompact(result.principal)}</p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-2">
                  <p className="text-[11px] text-muted-foreground">Total Interest</p>
                  <p className="mt-0.5 font-semibold text-rose-500">{formatINRCompact(result.totalInterest)}</p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-2">
                  <p className="text-[11px] text-muted-foreground">Total Payment</p>
                  <p className="mt-0.5 font-semibold">{formatINRCompact(result.totalPayment)}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <MiniBar label="Principal" value={result.principal} total={result.totalPayment} color="bg-primary" />
                <MiniBar label="Interest paid" value={result.totalInterest} total={result.totalPayment} color="bg-rose-400" />
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-xs">
                <span className="text-muted-foreground">Interest / Principal ratio</span>
                <Badge variant={result.interestToLoanRatio > 100 ? 'warning' : 'success'}>
                  {result.interestToLoanRatio}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Donut-style breakdown bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex h-10 overflow-hidden rounded-xl">
                <div
                  className="flex items-center justify-center bg-primary text-xs font-semibold text-white transition-all"
                  style={{ width: `${(result.principal / result.totalPayment) * 100}%` }}
                >
                  Principal
                </div>
                <div
                  className="flex items-center justify-center bg-rose-400 text-xs font-semibold text-white transition-all"
                  style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }}
                >
                  Interest
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatINR(result.principal)}</span>
                <span>{formatINR(result.totalInterest)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Amortization schedule */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">Amortization Schedule</p>
                <div className="flex overflow-hidden rounded-md border text-xs">
                  {(['summary', 'schedule'] as View[]).map((v) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-2.5 py-1 capitalize font-medium transition-colors ${view === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {view === 'summary' ? (
                <div className="space-y-3">
                  {[1, 3, 5, 10, 15, 20].filter(y => y <= tenureYears).map((yr) => {
                    const idx = yr * 12 - 1;
                    const row = result.schedule[Math.min(idx, result.schedule.length - 1)];
                    return (
                      <div key={yr} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-sm">
                        <span className="font-medium">Year {yr}</span>
                        <div className="flex gap-4 text-xs text-right">
                          <div>
                            <p className="text-muted-foreground">Balance</p>
                            <p className="font-semibold">{formatINRCompact(row.balance)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Paid so far</p>
                            <p className="font-semibold">{formatINRCompact(result.emi * yr * 12)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map((h) => (
                          <th key={h} className="pb-2 text-right font-medium first:text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {visibleRows.map((row) => (
                        <tr key={row.month} className="hover:bg-muted/30">
                          <td className="py-1.5 font-medium">{row.month}</td>
                          <td className="py-1.5 text-right">{formatINR(row.emi)}</td>
                          <td className="py-1.5 text-right text-emerald-600 dark:text-emerald-400">{formatINR(row.principal)}</td>
                          <td className="py-1.5 text-right text-rose-500">{formatINR(row.interest)}</td>
                          <td className="py-1.5 text-right">{formatINR(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!showFullSchedule && result.schedule.length > 24 && (
                    <button
                      onClick={() => setShowFullSchedule(true)}
                      className="mt-3 w-full rounded-lg border border-dashed py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      Show all {result.schedule.length} months ↓
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            EMI calculated using the standard reducing-balance method. Actual bank EMI may vary slightly.
          </p>
        </div>
      ) : (
        <div className="grid place-items-center rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground" style={{ minHeight: 300 }}>
          Adjust sliders to calculate your EMI
        </div>
      )}
    </div>
  );
}
