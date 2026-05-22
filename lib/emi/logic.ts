export type LoanType = 'home' | 'car' | 'personal' | 'education' | 'custom';

export type EMIInput = {
  principal: number;       // Loan amount in INR
  annualRate: number;      // Annual interest rate (%)
  tenureMonths: number;    // Loan tenure in months
};

export type EMIResult = {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  interestToLoanRatio: number;
  schedule: AmortizationRow[];
};

export type AmortizationRow = {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

export function calculateEMI(input: EMIInput): EMIResult | null {
  const { principal, annualRate, tenureMonths } = input;
  if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) return null;

  // Zero-interest loan
  if (annualRate === 0) {
    const emi = Math.round(principal / tenureMonths);
    const schedule: AmortizationRow[] = [];
    let balance = principal;
    for (let m = 1; m <= tenureMonths; m++) {
      const p = m === tenureMonths ? balance : emi;
      balance -= p;
      schedule.push({ month: m, emi: p, principal: p, interest: 0, balance: Math.max(0, balance) });
    }
    return { emi, totalPayment: principal, totalInterest: 0, principal, interestToLoanRatio: 0, schedule };
  }

  const r = annualRate / 12 / 100; // monthly rate
  const n = tenureMonths;
  const emi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterestPaid = 0;

  for (let m = 1; m <= n; m++) {
    const interestPart = Math.round(balance * r * 100) / 100;
    const principalPart = Math.round((emi - interestPart) * 100) / 100;
    balance = Math.round((balance - principalPart) * 100) / 100;
    totalInterestPaid += interestPart;
    schedule.push({
      month: m,
      emi,
      principal: principalPart,
      interest: interestPart,
      balance: Math.max(0, balance),
    });
  }

  const totalPayment = emi * n;
  const totalInterest = Math.round(totalInterestPaid);

  return {
    emi,
    totalPayment,
    totalInterest,
    principal,
    interestToLoanRatio: Math.round((totalInterest / principal) * 1000) / 10,
    schedule,
  };
}

export type LoanPreset = {
  type: LoanType;
  label: string;
  principal: number;
  rate: number;
  tenureYears: number;
};

export const LOAN_PRESETS: LoanPreset[] = [
  { type: 'home',     label: 'Home Loan',     principal: 5000000, rate: 8.5,  tenureYears: 20 },
  { type: 'car',      label: 'Car Loan',      principal: 800000,  rate: 9.0,  tenureYears: 5  },
  { type: 'personal', label: 'Personal Loan', principal: 500000,  rate: 12.0, tenureYears: 3  },
  { type: 'education',label: 'Education Loan',principal: 1500000, rate: 8.0,  tenureYears: 7  },
];

export function formatINR(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

export function formatINRCompact(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)}L`;
  if (n >= 1000)       return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}
