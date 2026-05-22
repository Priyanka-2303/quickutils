import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { EMITool } from '@/components/emi-calculator/EMITool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'EMI Calculator — Home, Car & Personal Loan EMI Calculator India',
  description:
    'Free EMI calculator for home loan, car loan, personal loan and education loan. Get monthly EMI, total interest payable and full amortization schedule instantly. No signup required.',
  path: '/emi-calculator',
  keywords: [
    'EMI calculator',
    'EMI calculator India',
    'home loan EMI calculator',
    'car loan EMI calculator',
    'personal loan EMI calculator',
    'loan EMI calculator online',
    'loan calculator India',
    'amortization schedule calculator',
    'monthly installment calculator',
    'loan interest calculator India',
    'SBI home loan EMI calculator',
    'HDFC EMI calculator',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What is EMI?',
    answer:
      'EMI (Equated Monthly Instalment) is the fixed amount you pay to a lender every month to repay a loan. Each EMI consists of two parts: a principal component that reduces your outstanding loan, and an interest component charged on the remaining balance.',
  },
  {
    question: 'How is EMI calculated?',
    answer:
      'EMI = [P × R × (1+R)^N] ÷ [(1+R)^N − 1], where P is the principal loan amount, R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the number of monthly instalments (tenure in months).',
  },
  {
    question: 'What is the amortization schedule?',
    answer:
      'An amortization schedule is a month-by-month table showing how each EMI is split between principal and interest, and what the outstanding loan balance is after each payment. In early months, most of the EMI goes toward interest. Over time, the principal component increases.',
  },
  {
    question: 'Does prepaying a loan save interest?',
    answer:
      'Yes, significantly. Making a partial prepayment reduces your outstanding principal, which lowers the interest charged in subsequent months. You can either reduce your EMI or keep the same EMI and shorten the tenure — reducing tenure saves more total interest.',
  },
  {
    question: 'What is the current home loan interest rate?',
    answer:
      'Home loan interest rates in India typically range from 8.35% to 9.5% per annum (as of 2024), depending on the bank and your credit score. Use the preset or enter your bank\'s offered rate to calculate your exact EMI.',
  },
  {
    question: 'What is the difference between flat rate and reducing balance EMI?',
    answer:
      'Flat rate interest is calculated on the full principal throughout the tenure — higher effective cost. Reducing balance (used by most banks) calculates interest only on the outstanding principal after each payment — fairer and standard for home, car, and personal loans. This calculator uses the reducing balance method.',
  },
];

export default function Page() {
  const tool = getTool('emi-calculator')!;
  const related = getRelatedTools('emi-calculator');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'EMI Calculator',
        headline: 'Calculate Loan EMI with Full Amortization',
        subheadline:
          'Home, car, personal, and education loan EMIs. Monthly schedule, total interest, and year-wise breakdown.',
      }}
      contentBlocks={[
        {
          title: 'How to use the EMI calculator',
          body: (
            <ol>
              <li>Select a loan preset (Home, Car, Personal, Education) or adjust the sliders manually.</li>
              <li>Set the <strong>loan amount</strong> — what you plan to borrow.</li>
              <li>Set the <strong>interest rate</strong> — check your bank&apos;s current rate.</li>
              <li>Set the <strong>tenure</strong> — longer tenure means lower EMI but more total interest.</li>
              <li>Switch to the <strong>Schedule</strong> tab to see the full month-by-month amortization table.</li>
            </ol>
          ),
        },
        {
          title: 'Tips to reduce your loan interest burden',
          body: (
            <ul>
              <li><strong>Higher down payment</strong> — borrow less to pay less interest overall.</li>
              <li><strong>Shorter tenure</strong> — the EMI is higher but total interest paid is much lower.</li>
              <li><strong>Prepayments</strong> — even one extra EMI per year dramatically shortens the loan.</li>
              <li><strong>Good credit score</strong> — a CIBIL score above 750 qualifies for lower interest rates.</li>
              <li><strong>Compare lenders</strong> — a 0.5% difference in rate on a ₹50L home loan saves ~₹5L over 20 years.</li>
            </ul>
          ),
        },
      ]}
      howToSteps={[
        { name: 'Select your loan type', text: 'Choose from Home Loan, Car Loan, Personal Loan, or Education Loan preset — or enter a custom loan amount using the slider.' },
        { name: 'Enter loan amount, interest rate and tenure', text: 'Set the principal you want to borrow, the annual interest rate offered by your bank, and your preferred repayment tenure in years.' },
        { name: 'Read your EMI and view the amortization schedule', text: 'Your monthly EMI, total interest, and total payment appear instantly. Switch to the Schedule tab for a month-by-month breakdown of principal vs interest.' },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <EMITool />
    </ToolPageLayout>
  );
}
