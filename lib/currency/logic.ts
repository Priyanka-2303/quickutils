/**
 * Currency Converter logic.
 * Uses the Frankfurter API (https://www.frankfurter.app) — free, no API key,
 * backed by the European Central Bank. Updated every business day.
 */

export type CurrencyCode = string;

export type RatesResponse = {
  amount: number;
  base: CurrencyCode;
  date: string;
  rates: Record<CurrencyCode, number>;
};

export type ConversionResult = {
  from: CurrencyCode;
  to: CurrencyCode;
  amount: number;
  result: number;
  rate: number;
  date: string;
};

/** All currencies supported by the Frankfurter API */
export const CURRENCIES: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar',           symbol: '$'  },
  { code: 'EUR', name: 'Euro',                symbol: '€'  },
  { code: 'GBP', name: 'British Pound',       symbol: '£'  },
  { code: 'INR', name: 'Indian Rupee',        symbol: '₹'  },
  { code: 'JPY', name: 'Japanese Yen',        symbol: '¥'  },
  { code: 'CAD', name: 'Canadian Dollar',     symbol: 'CA$'},
  { code: 'AUD', name: 'Australian Dollar',   symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc',         symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan',        symbol: '¥'  },
  { code: 'SGD', name: 'Singapore Dollar',    symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham',          symbol: 'د.إ'},
  { code: 'HKD', name: 'Hong Kong Dollar',    symbol: 'HK$'},
  { code: 'KRW', name: 'South Korean Won',    symbol: '₩'  },
  { code: 'MXN', name: 'Mexican Peso',        symbol: 'MX$'},
  { code: 'BRL', name: 'Brazilian Real',      symbol: 'R$' },
  { code: 'IDR', name: 'Indonesian Rupiah',   symbol: 'Rp' },
  { code: 'MYR', name: 'Malaysian Ringgit',   symbol: 'RM' },
  { code: 'THB', name: 'Thai Baht',           symbol: '฿'  },
  { code: 'PHP', name: 'Philippine Peso',     symbol: '₱'  },
  { code: 'SEK', name: 'Swedish Krona',       symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone',     symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone',        symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar',  symbol: 'NZ$'},
  { code: 'ZAR', name: 'South African Rand',  symbol: 'R'  },
  { code: 'TRY', name: 'Turkish Lira',        symbol: '₺'  },
  { code: 'PLN', name: 'Polish Zloty',        symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna',        symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint',    symbol: 'Ft' },
  { code: 'ILS', name: 'Israeli Shekel',      symbol: '₪'  },
  { code: 'RON', name: 'Romanian Leu',        symbol: 'lei'},
  { code: 'BGN', name: 'Bulgarian Lev',       symbol: 'лв' },
  { code: 'ISK', name: 'Icelandic Króna',     symbol: 'kr' },
];

/** Quick-access currencies shown prominently in the multi-board */
export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD',
  'AUD', 'CHF', 'CNY', 'SGD', 'AED', 'HKD',
];

export function getCurrency(code: CurrencyCode) {
  return CURRENCIES.find((c) => c.code === code);
}

export function formatAmount(amount: number, code: CurrencyCode): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style:    'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: code === 'JPY' || code === 'KRW' || code === 'IDR' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${code}`;
  }
}

const FRANKFURTER = 'https://api.frankfurter.app';

/**
 * Fetch all rates for a given base currency.
 * Returns null on network/API failure.
 */
export async function fetchRates(base: CurrencyCode): Promise<RatesResponse | null> {
  try {
    const res = await fetch(`${FRANKFURTER}/latest?from=${base}`, {
      next: { revalidate: 3600 }, // cache 1 hour in Next.js fetch
    });
    if (!res.ok) return null;
    return res.json() as Promise<RatesResponse>;
  } catch {
    return null;
  }
}

export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: RatesResponse,
): ConversionResult | null {
  if (from === to) {
    return { from, to, amount, result: amount, rate: 1, date: rates.date };
  }
  const rate = rates.rates[to];
  if (!rate) return null;
  return {
    from,
    to,
    amount,
    result: amount * rate,
    rate,
    date: rates.date,
  };
}
