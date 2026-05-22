export type GSTRate = 0 | 5 | 12 | 18 | 28;
export type GSTType = 'intra' | 'inter'; // intra-state (CGST+SGST) vs inter-state (IGST)
export type CalcMode = 'exclusive' | 'inclusive';

export type GSTResult = {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;   // only for intra-state
  sgst: number;   // only for intra-state
  igst: number;   // only for inter-state
  rate: GSTRate;
  type: GSTType;
  mode: CalcMode;
};

export const GST_RATES: GSTRate[] = [0, 5, 12, 18, 28];

export const GST_RATE_EXAMPLES: Record<GSTRate, string> = {
  0:  'Essential food, healthcare, education',
  5:  'Packed food, transport, small restaurants',
  12: 'Processed food, mobile phones, computers',
  18: 'Most services, electronics, restaurants',
  28: 'Luxury goods, cars, tobacco, aerated drinks',
};

export function calculateGST(
  amount: number,
  rate: GSTRate,
  type: GSTType,
  mode: CalcMode,
): GSTResult {
  let baseAmount: number;
  let gstAmount: number;

  if (mode === 'exclusive') {
    // Amount given is pre-GST
    baseAmount = amount;
    gstAmount = Math.round(amount * (rate / 100) * 100) / 100;
  } else {
    // Amount given is inclusive of GST — work backwards
    baseAmount = Math.round((amount / (1 + rate / 100)) * 100) / 100;
    gstAmount = Math.round((amount - baseAmount) * 100) / 100;
  }

  const totalAmount = mode === 'exclusive'
    ? Math.round((baseAmount + gstAmount) * 100) / 100
    : amount;

  const halfGst = Math.round((gstAmount / 2) * 100) / 100;

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    cgst: type === 'intra' ? halfGst : 0,
    sgst: type === 'intra' ? halfGst : 0,
    igst: type === 'inter' ? gstAmount : 0,
    rate,
    type,
    mode,
  };
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}
