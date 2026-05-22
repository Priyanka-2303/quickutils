'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateSalary, formatINR, formatINRCompact, type TaxRegime } from '@/lib/salary/logic';

type InputState = {
  ctc: string;
  regime: TaxRegime;
  monthlyRent: string;
  isMetro: boolean;
  deductions80C: string;
  deductions80D: string;
};

function InputField({
  label, value, onChange, prefix, hint, min = 0, max,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; hint?: string; min?: number; max?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex h-9 items-center overflow-hidden rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
        {prefix && (
          <span className="border-r bg-muted px-2.5 py-1.5 text-sm text-muted-foreground">{prefix}</span>
        )}
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-2.5 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function BreakdownRow({
  label, value, sub, highlight, indent,
}: {
  label: string; value: string; sub?: string; highlight?: 'green' | 'red' | 'blue'; indent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 text-sm ${indent ? 'pl-4' : ''}`}>
      <span className={`text-muted-foreground ${indent ? 'text-xs' : ''}`}>{label}</span>
      <div className="text-right">
        <span className={
          highlight === 'green' ? 'font-semibold text-emerald-600 dark:text-emerald-400' :
          highlight === 'red'   ? 'font-medium text-rose-600 dark:text-rose-400' :
          highlight === 'blue'  ? 'font-bold text-primary text-base' :
          'font-medium'
        }>{value}</span>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function SalaryTool() {
  const [form, setForm] = useState<InputState>({
    ctc: '1500000',
    regime: 'new',
    monthlyRent: '20000',
    isMetro: true,
    deductions80C: '150000',
    deductions80D: '25000',
  });

  const set = (key: keyof InputState) => (v: string | boolean) =>
    setForm((f) => ({ ...f, [key]: v }));

  const result = useMemo(() => {
    const ctc = parseFloat(form.ctc) || 0;
    if (ctc <= 0) return null;
    return calculateSalary({
      ctc,
      regime: form.regime,
      monthlyRent: parseFloat(form.monthlyRent) || 0,
      isMetro: form.isMetro,
      deductions80C: parseFloat(form.deductions80C) || 0,
      deductions80D: parseFloat(form.deductions80D) || 0,
    });
  }, [form]);

  // Compare both regimes
  const comparison = useMemo(() => {
    const ctc = parseFloat(form.ctc) || 0;
    if (ctc <= 0) return null;
    const base = { ctc, monthlyRent: parseFloat(form.monthlyRent) || 0, isMetro: form.isMetro, deductions80C: parseFloat(form.deductions80C) || 0, deductions80D: parseFloat(form.deductions80D) || 0 };
    return {
      new: calculateSalary({ ...base, regime: 'new' }),
      old: calculateSalary({ ...base, regime: 'old' }),
    };
  }, [form]);

  const betterRegime = comparison
    ? comparison.new.netAnnual >= comparison.old.netAnnual ? 'new' : 'old'
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* Inputs */}
      <div className="space-y-5">
        <Card>
          <CardContent className="space-y-4 p-4">
            <h3 className="font-semibold">Salary Details</h3>
            <InputField label="Annual CTC" value={form.ctc} onChange={set('ctc')}
              prefix="₹" hint="Total cost to company per year" min={0} />

            <div className="space-y-1">
              <label className="text-sm font-medium">Tax Regime</label>
              <div className="flex overflow-hidden rounded-lg border text-sm">
                {(['new', 'old'] as TaxRegime[]).map((r) => (
                  <button key={r} onClick={() => set('regime')(r)}
                    className={`flex-1 py-2 font-medium capitalize transition-colors ${form.regime === r ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    {r} Regime
                  </button>
                ))}
              </div>
              {betterRegime && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  💡 {betterRegime === 'new' ? 'New' : 'Old'} regime saves you more — {formatINRCompact(Math.abs((comparison!.new.netAnnual - comparison!.old.netAnnual)))} per year
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {form.regime === 'old' && (
          <Card>
            <CardContent className="space-y-4 p-4">
              <h3 className="font-semibold text-sm">Old Regime Deductions</h3>
              <InputField label="Monthly rent paid" value={form.monthlyRent}
                onChange={set('monthlyRent')} prefix="₹" hint="For HRA exemption" />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="metro" checked={form.isMetro}
                  onChange={(e) => set('isMetro')(e.target.checked)}
                  className="h-4 w-4 rounded border" />
                <label htmlFor="metro" className="text-sm">Metro city (Mumbai, Delhi, Chennai, Kolkata)</label>
              </div>
              <InputField label="80C deductions" value={form.deductions80C}
                onChange={set('deductions80C')} prefix="₹" hint="PF, ELSS, LIC, PPF etc. (max ₹1.5L)" max={150000} />
              <InputField label="80D deductions" value={form.deductions80D}
                onChange={set('deductions80D')} prefix="₹" hint="Health insurance premium (max ₹25K)" max={75000} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-4">
          {/* Hero card */}
          <Card className="overflow-hidden">
            <div className="bg-primary/5 px-5 py-4">
              <p className="text-sm text-muted-foreground">Monthly take-home</p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-primary">
                {formatINR(result.netMonthly)}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatINR(result.netAnnual)} per year · {result.regime === 'new' ? 'New' : 'Old'} Regime
              </p>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <MiniBar label="Take-home" value={result.netAnnual} total={result.grossSalary} color="bg-emerald-500" />
                <MiniBar label="Income tax + cess" value={result.incomeTax + result.educationCess} total={result.grossSalary} color="bg-rose-400" />
                <MiniBar label="Provident Fund" value={result.employeePF} total={result.grossSalary} color="bg-violet-400" />
                <MiniBar label="Professional Tax" value={result.professionalTax} total={result.grossSalary} color="bg-amber-400" />
              </div>
            </CardContent>
          </Card>

          {/* Salary structure */}
          <Card>
            <CardContent className="p-4">
              <p className="mb-2 text-sm font-semibold">Gross Salary Structure</p>
              <div className="divide-y">
                <BreakdownRow label="Basic salary (40% of CTC)" value={formatINR(result.basic)} sub={formatINR(Math.round(result.basic / 12)) + '/mo'} />
                <BreakdownRow label="HRA" value={formatINR(result.hra)} sub={formatINR(Math.round(result.hra / 12)) + '/mo'} />
                <BreakdownRow label="Special allowance" value={formatINR(result.specialAllowance)} sub={formatINR(Math.round(result.specialAllowance / 12)) + '/mo'} />
                <BreakdownRow label="Gross salary" value={formatINR(result.grossSalary)} highlight="green" sub={formatINR(Math.round(result.grossSalary / 12)) + '/mo'} />
              </div>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card>
            <CardContent className="p-4">
              <p className="mb-2 text-sm font-semibold">Deductions</p>
              <div className="divide-y">
                <BreakdownRow label="Employee PF (12%)" value={`− ${formatINR(result.employeePF)}`} />
                <BreakdownRow label="Professional Tax" value={`− ${formatINR(result.professionalTax)}`} />
                <BreakdownRow label="Taxable income" value={formatINR(result.taxableIncome)} />
                <BreakdownRow label="Income tax" value={`− ${formatINR(result.incomeTax)}`} highlight="red" />
                <BreakdownRow label="Education cess (4%)" value={`− ${formatINR(result.educationCess)}`} indent />
                <BreakdownRow label="Total deductions" value={`− ${formatINR(result.totalDeductions)}`} highlight="red" />
              </div>
            </CardContent>
          </Card>

          {/* Tax summary */}
          <Card>
            <CardContent className="flex flex-wrap items-center gap-4 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Effective tax rate</p>
                <p className="text-2xl font-bold">{result.effectiveTaxRate}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Employer PF (your real cost)</p>
                <p className="text-lg font-semibold">{formatINR(result.employerPF)}</p>
              </div>
              <Badge variant={result.regime === 'new' ? 'default' : 'secondary'} className="self-center">
                {result.regime === 'new' ? 'New' : 'Old'} Regime
              </Badge>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            Estimates based on FY 2024-25 tax slabs. Consult a CA for personalised advice.
          </p>
        </div>
      ) : (
        <div className="grid place-items-center rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground" style={{ minHeight: 300 }}>
          Enter your CTC to see the breakdown
        </div>
      )}
    </div>
  );
}
