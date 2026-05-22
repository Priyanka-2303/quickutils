import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { CountdownTool } from '@/components/countdown-timer/CountdownTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Countdown Timer — Shareable Countdown to Any Date',
  description:
    'Create a countdown to any date or event. Share a live countdown link, pick from presets like New Year or Diwali, and watch the animated timer tick down in real time.',
  path: '/countdown-timer',
  keywords: [
    'countdown timer',
    'countdown to date',
    'shareable countdown',
    'event countdown',
    'online countdown timer',
    'new year countdown',
    'days until calculator',
    'countdown clock',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'How do I share a countdown?',
    answer:
      'Click the "Share link" button — it copies a URL with your target date and title encoded as query parameters. Anyone who opens that link will see the same countdown ticking in real time in their browser.',
  },
  {
    question: 'Does the countdown work offline?',
    answer:
      'Yes. The timer runs entirely in the browser using JavaScript. Once the page has loaded, no network connection is needed for it to keep ticking.',
  },
  {
    question: 'Can I create multiple countdowns?',
    answer:
      'Yes. Open the tool in separate browser tabs, set a different date in each, and use "Share link" to save each countdown URL as a bookmark or send it to others.',
  },
  {
    question: 'What are the quick presets?',
    answer:
      'The presets include fixed calendar events (New Year 2026, Diwali 2025, Christmas 2025) and relative offsets (In 1 hour, In 24 hours, In 7 days). Clicking a preset instantly updates the countdown and title.',
  },
  {
    question: 'What happens when the countdown reaches zero?',
    answer:
      'The digits are replaced with a "🎉 Time\'s up!" message and the progress bar fills to 100%. The timer stops automatically.',
  },
];

export default function Page() {
  const tool = getTool('countdown-timer')!;
  const related = getRelatedTools('countdown-timer');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Countdown Timer',
        headline: 'Countdown to Any Date',
        subheadline:
          'Animated live timer. Custom title. Shareable link. Quick presets for holidays and intervals.',
      }}
      contentBlocks={[
        {
          title: 'Why a shareable countdown?',
          body: (
            <p>
              Whether it&apos;s a product launch, a holiday, a wedding, or just &ldquo;days until
              Friday&rdquo; — a countdown link lets you share the excitement. The target date and
              title are stored directly in the URL, so no account or server is needed. Bookmark it,
              paste it in Slack, or pin it to your phone&apos;s home screen.
            </p>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <CountdownTool />
    </ToolPageLayout>
  );
}
