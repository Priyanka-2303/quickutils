import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { GSTTool } from '@/components/gst-calculator/GSTTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'GST Calculator India — Calculate GST Online Free',
  description:
    'Calculate GST instantly for any amount. Supports all GST rates (0%, 5%, 12%, 18%, 28%), intra-state (CGST+SGST) and inter-state (IGST), inclusive and exclusive modes. Free, browser-based.',
  path: '/gst-calculator',
  keywords: [
    'GST calculator',
    'GST calculator India',
    'calculate GST online',
    'GST inclusive exclusive calculator',
    'CGST SGST calculator',
    'IGST calculator',
    'GST percentage calculator',
    'online GST calculator free',
    '18% GST calculator',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What are the GST rates in India?',
    answer:
      'India has five main GST slabs: 0% (essential items like fresh food, healthcare), 5% (packed food, transport), 12% (processed food, computers), 18% (most services, electronics, restaurants), and 28% (luxury goods, cars, tobacco, aerated drinks).',
  },
  {
    question: 'What is the difference between CGST, SGST, and IGST?',
    answer:
      'For intra-state transactions (buyer and seller in the same state), the GST is split equally between the Central Government (CGST) and State Government (SGST). For inter-state transactions (different states), the entire GST is collected as IGST by the Central Government and later shared with the destination state.',
  },
  {
    question: 'What does GST inclusive vs exclusive mean?',
    answer:
      'GST exclusive means the entered amount does not include tax — GST is calculated on top. GST inclusive means the amount already contains GST — the calculator extracts the base amount and tax component from it.',
  },
  {
    question: 'How do I calculate GST from a total (inclusive)?',
    answer:
      'To find the base amount from a GST-inclusive price: Base = Total ÷ (1 + GST rate/100). For example, if the total is ₹11,800 at 18% GST: Base = 11800 ÷ 1.18 = ₹10,000. The calculator does this automatically in Inclusive mode.',
  },
  {
    question: 'Which items are exempt from GST?',
    answer:
      'Items with 0% GST include fresh fruits and vegetables, unbranded food grains, milk, eggs, salt, unprocessed meat and fish, healthcare services, and educational services. Petrol and alcohol are outside GST and taxed separately.',
  },
  {
    question: 'What is the GST rate for services?',
    answer:
      'Most services in India attract 18% GST — IT services, consulting, banking, telecom, hotel stays above ₹7,500/night, and restaurants in malls/hotels. Basic financial services, healthcare, and education are exempt. Restaurants not in hotels attract 5% GST (without ITC).',
  },
];

export default function Page() {
  const tool = getTool('gst-calculator')!;
  const related = getRelatedTools('gst-calculator');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'GST Calculator India',
        headline: 'Calculate GST Instantly — All Rates & Types',
        subheadline:
          'CGST, SGST, IGST breakdown. Inclusive & exclusive modes. All 5 GST slabs. Fully browser-based.',
      }}
      contentBlocks={[
        {
          title: 'How GST works in India',
          body: (
            <p>
              Goods and Services Tax (GST) is a unified indirect tax levied on goods and services
              across India. It replaced multiple central and state taxes (VAT, service tax, excise
              duty) in July 2017. GST is collected at every stage of the supply chain but ultimately
              borne by the end consumer. Input Tax Credit (ITC) allows businesses to offset GST paid
              on purchases against GST collected on sales.
            </p>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <GSTTool />
    </ToolPageLayout>
  );
}
