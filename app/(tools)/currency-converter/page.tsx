import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { CurrencyTool } from '@/components/currency-converter/CurrencyTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Currency Converter — Live Exchange Rates Online Free',
  description:
    'Convert between 30+ currencies with live ECB exchange rates. USD to INR, EUR to GBP, and more — instant results, no ads, no signup required.',
  path: '/currency-converter',
  keywords: [
    'currency converter',
    'currency converter online',
    'exchange rate calculator',
    'USD to INR',
    'USD to EUR',
    'EUR to GBP',
    'live exchange rates',
    'foreign exchange calculator',
    'forex converter online',
    'currency exchange rate today',
    'dollar to rupee',
    'pound to rupee',
    'free currency converter',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'Where do the exchange rates come from?',
    answer:
      'Rates are sourced from the European Central Bank (ECB) via the free Frankfurter API. They are updated every business day. The date of the latest available rate is shown below the result.',
  },
  {
    question: 'How accurate are the rates?',
    answer:
      'The rates reflect official ECB reference rates, which are widely used as benchmark rates. They are accurate for informational purposes but may differ slightly from rates offered by banks and money transfer services, which include their own margins.',
  },
  {
    question: 'Which currencies are supported?',
    answer:
      'The tool supports 32 major currencies including USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, SGD, AED, HKD, KRW, BRL, and more. All currencies listed by the ECB are available.',
  },
  {
    question: 'What is the current USD to INR exchange rate?',
    answer:
      'The USD to INR rate fluctuates daily. Open the converter, select USD as the source currency and INR as the target, and the current ECB rate will be shown. As of early 2025, 1 USD is approximately ₹83–84.',
  },
  {
    question: 'Can I use this for financial transactions?',
    answer:
      'This tool is for informational purposes only. For actual money transfers or currency exchanges, always check the rate offered by your bank or money transfer provider, as they include fees and margins on top of the reference rate.',
  },
  {
    question: 'Why does clicking a currency in the board change the "To" field?',
    answer:
      'The multi-currency board at the bottom shows your amount converted into popular currencies at a glance. Clicking any card sets that currency as the "To" currency in the main converter so you can see the precise result and rate.',
  },
];

export default function Page() {
  const tool = getTool('currency-converter')!;
  const related = getRelatedTools('currency-converter');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Currency Converter',
        headline: 'Convert Currency with Live Exchange Rates',
        subheadline:
          'Live ECB rates. 32 currencies. Instant conversion. Multi-currency board. Free.',
      }}
      howToSteps={[
        {
          name: 'Enter the amount',
          text: 'Type the amount you want to convert in the Amount field. Any number works — whole numbers or decimals.',
        },
        {
          name: 'Select source and target currencies',
          text: 'Choose your "From" and "To" currencies using the dropdowns. You can search by currency code (USD, INR) or name (Dollar, Rupee). Click the swap button to reverse the conversion.',
        },
        {
          name: 'Read the result and explore the board',
          text: 'The converted amount appears instantly using live ECB rates. The multi-currency board below shows your amount in 11 other popular currencies simultaneously — click any to set it as your target.',
        },
      ]}
      contentBlocks={[
        {
          title: 'Live exchange rates, updated daily',
          body: (
            <p>
              Exchange rates fluctuate every business day based on central bank policy, inflation,
              trade balances, and global events. This converter fetches reference rates from the
              European Central Bank (ECB) — the same rates used by financial institutions as a
              benchmark. Rates are cached and refreshed each business day, so you always see
              a current figure rather than a stale historical rate.
            </p>
          ),
        },
        {
          title: 'Popular conversions',
          body: (
            <ul>
              <li><strong>USD to INR</strong> — Used by the Indian diaspora, freelancers paid in dollars, and importers.</li>
              <li><strong>EUR to INR</strong> — Common for travellers to Europe and EU-based remittances.</li>
              <li><strong>GBP to INR</strong> — UK-India corridor, one of the largest remittance routes in the world.</li>
              <li><strong>USD to EUR</strong> — The world&apos;s most-traded currency pair.</li>
              <li><strong>AED to INR</strong> — UAE is the top source of remittances to India.</li>
            </ul>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <CurrencyTool />
    </ToolPageLayout>
  );
}
