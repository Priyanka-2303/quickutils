/**
 * Indian salary calculator — CTC to take-home breakdown.
 * Supports both Old and New tax regimes (FY 2024-25).
 */

export type TaxRegime = 'new' | 'old';

export type SalaryInput = {
  ctc: number;           // Annual CTC in INR
  regime: TaxRegime;
  /** Extra HRA exemption (monthly rent paid) for old regime */
  monthlyRent?: number;
  /** Metro city (affects HRA exemption calculation) */
  isMetro?: boolean;
  /** Extra deductions under 80C, 80D etc. for old regime (annual) */
  deductions80C?: number;
  deductions80D?: number;
};

export type SalaryBreakdown = {
  // Gross structure
  basic: number;
  hra: number;
  specialAllowance: number;
  grossSalary: number;
  // Deductions
  employeePF: number;
  employerPF: number;
  professionalTax: number;
  // Tax
  taxableIncome: number;
  incomeTax: number;
  educationCess: number;
  // Net
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  // Effective rates
  effectiveTaxRate: number;
  regime: TaxRegime;
};

const PF_WAGE_LIMIT = 15000;
const PF_RATE = 0.12;
const PROFESSIONAL_TAX_ANNUAL = 2400; // ₹200/month most states

function calcBasic(ctc: number) { return Math.round(ctc * 0.4); }
function calcHRA(basic: number, isMetro: boolean) {
  return Math.round(basic * (isMetro ? 0.5 : 0.4));
}

/** Old regime slabs FY 2024-25 */
function oldRegimeTax(taxableIncome: number): number {
  const slabs = [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.2 },
    { upto: Infinity, rate: 0.3 },
  ];
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const chunk = Math.min(taxableIncome, slab.upto) - prev;
    tax += chunk * slab.rate;
    prev = slab.upto;
  }
  // 87A rebate: nil tax if taxable income ≤ 5L
  if (taxableIncome <= 500000) tax = 0;
  return Math.round(tax);
}

/** New regime slabs FY 2024-25 (post Budget 2024) */
function newRegimeTax(taxableIncome: number): number {
  const slabs = [
    { upto: 300000,  rate: 0 },
    { upto: 700000,  rate: 0.05 },
    { upto: 1000000, rate: 0.1 },
    { upto: 1200000, rate: 0.15 },
    { upto: 1500000, rate: 0.2 },
    { upto: Infinity, rate: 0.3 },
  ];
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const chunk = Math.min(taxableIncome, slab.upto) - prev;
    tax += chunk * slab.rate;
    prev = slab.upto;
  }
  // 87A rebate: nil tax if taxable income ≤ 7L (new regime)
  if (taxableIncome <= 700000) tax = 0;
  return Math.round(tax);
}

/** HRA exemption for old regime (min of three conditions) */
function hraExemption(
  basic: number, hra: number, monthlyRent: number, isMetro: boolean,
): number {
  if (monthlyRent === 0) return 0;
  const annualRent = monthlyRent * 12;
  const c1 = hra;
  const c2 = isMetro ? basic * 0.5 : basic * 0.4;
  const c3 = Math.max(0, annualRent - basic * 0.1);
  return Math.round(Math.min(c1, c2, c3));
}

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const { ctc, regime, monthlyRent = 0, isMetro = false, deductions80C = 150000, deductions80D = 25000 } = input;

  const basic = calcBasic(ctc);
  const hra = calcHRA(basic, isMetro);
  const pfWage = Math.min(basic, PF_WAGE_LIMIT);
  const employeePF = Math.round(pfWage * PF_RATE * 12);
  const employerPF = Math.round(pfWage * PF_RATE * 12);
  const specialAllowance = Math.max(0, ctc - basic - hra - employerPF);
  const grossSalary = basic + hra + specialAllowance; // employee gross (excludes employer PF)
  const professionalTax = PROFESSIONAL_TAX_ANNUAL;

  let taxableIncome: number;
  let incomeTax: number;

  if (regime === 'new') {
    // New regime: standard deduction ₹75,000 (Budget 2024), no other exemptions
    const standardDeduction = 75000;
    taxableIncome = Math.max(0, grossSalary - employeePF - standardDeduction);
    incomeTax = newRegimeTax(taxableIncome);
  } else {
    // Old regime: HRA exemption + 80C + 80D + standard deduction ₹50,000
    const standardDeduction = 50000;
    const hraExempt = hraExemption(basic, hra, monthlyRent, isMetro);
    const total80C = Math.min(deductions80C, 150000);
    const total80D = Math.min(deductions80D, 25000);
    taxableIncome = Math.max(
      0,
      grossSalary - employeePF - standardDeduction - hraExempt - total80C - total80D,
    );
    incomeTax = oldRegimeTax(taxableIncome);
  }

  const educationCess = Math.round(incomeTax * 0.04);
  const totalTax = incomeTax + educationCess;
  const totalDeductions = employeePF + professionalTax + totalTax;
  const netAnnual = grossSalary - totalDeductions;
  const netMonthly = Math.round(netAnnual / 12);
  const effectiveTaxRate = grossSalary > 0 ? (totalTax / grossSalary) * 100 : 0;

  return {
    basic, hra, specialAllowance, grossSalary,
    employeePF, employerPF, professionalTax,
    taxableIncome, incomeTax, educationCess,
    totalDeductions, netAnnual, netMonthly,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    regime,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRCompact(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}
