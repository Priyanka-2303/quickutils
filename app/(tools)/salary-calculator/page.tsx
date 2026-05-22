import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { SalaryTool } from '@/components/salary-calculator/SalaryTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Salary Calculator India — CTC to Take-Home Pay 2024-25',
  description:
    'Calculate your take-home salary from CTC. Supports Old and New tax regime, HRA exemption, PF, 80C & 80D deductions. FY 2024-25 Indian income tax slabs. Free, instant, browser-based.',
  path: '/salary-calculator',
  keywords: [
    'salary calculator india',
    'CTC to take home salary',
    'in hand salary calculator',
    'new tax regime calculator',
    'old tax regime calculator',
    'income tax calculator 2024-25',
    'take home salary calculator',
    'HRA exemption calculator',
    'salary breakup calculator',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What is CTC and how is take-home salary calculated?',
    answer:
      'CTC (Cost to Company) is the total amount a company spends on an employee per year, including salary, employer PF, and benefits. Take-home salary is CTC minus employee PF, professional tax, and income tax.',
  },
  {
    question: 'Which tax regime is better — Old or New?',
    answer:
      'The New Regime is better if your deductions are low. The Old Regime is better if you have significant deductions: HRA exemption, 80C investments (₹1.5L), 80D health insurance, and home loan interest. Use the calculator to compare both automatically.',
  },
  {
    question: 'What is the standard deduction in FY 2024-25?',
    answer:
      'The standard deduction is ₹75,000 under the New Regime and ₹50,000 under the Old Regime (enhanced in Budget 2024). It is automatically deducted from gross salary before computing tax.',
  },
  {
    question: 'What is the income tax rebate under Section 87A?',
    answer:
      'Under the New Regime, if your taxable income is ₹7 lakh or below, you pay zero income tax due to the 87A rebate. Under the Old Regime, the rebate applies if taxable income is ₹5 lakh or below.',
  },
  {
    question: 'How is HRA exemption calculated?',
    answer:
      'HRA exemption (Old Regime only) is the minimum of: (1) actual HRA received, (2) 50% of basic for metro cities or 40% for non-metro, and (3) annual rent paid minus 10% of basic salary.',
  },
  {
    question: 'What is the PF deduction on salary?',
    answer:
      'Provident Fund (PF) is deducted at 12% of basic salary, capped at ₹15,000 basic (so max ₹1,800/month employee contribution). The employer also contributes an equal amount, which is part of your CTC.',
  },
  {
    question: 'Is this calculator accurate for all states?',
    answer:
      'The tax calculations are accurate for central income tax across India. Professional tax varies by state — the calculator uses ₹2,400 per year (₹200/month), which applies to most states like Maharashtra, Karnataka, and West Bengal.',
  },
];

export default function Page() {
  const tool = getTool('salary-calculator')!;
  const related = getRelatedTools('salary-calculator');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Salary Calculator India',
        headline: 'Know Your Exact Take-Home Salary',
        subheadline:
          'CTC to in-hand salary with Old vs New regime comparison, HRA exemption, PF and full tax breakdown. FY 2024-25.',
      }}
      contentBlocks={[
        {
          title: 'How Indian salary structure works',
          body: (
            <>
              <p>
                Your CTC (Cost to Company) is not what lands in your bank account. It typically includes
                basic salary (≈40%), HRA (≈20% metro / 16% non-metro), special allowances, and
                employer PF contribution. The amount you actually receive is gross salary minus
                employee PF, professional tax, and income tax.
              </p>
              <p>
                <strong>New vs Old Regime:</strong> The New Regime (introduced in 2020 and improved
                in 2023/24) offers lower slab rates but removes most exemptions and deductions.
                The Old Regime lets you claim HRA, 80C, 80D, LTA, and home loan interest — making
                it better if your total deductions exceed roughly ₹3.75 lakh.
              </p>
            </>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <SalaryTool />
    </ToolPageLayout>
  );
}
