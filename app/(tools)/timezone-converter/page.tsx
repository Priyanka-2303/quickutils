import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { TimezoneTool } from '@/components/timezone-converter/TimezoneTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Timezone Converter — Convert Time Between Timezones Free',
  description:
    'Convert time between any timezones instantly. Live clock, custom date/time conversion, DST-aware, supports all IANA timezones. Free, browser-based.',
  path: '/timezone-converter',
  keywords: [
    'timezone converter',
    'time zone converter',
    'convert time zones online',
    'world clock',
    'IST to EST converter',
    'time difference calculator',
    'DST timezone converter',
    'free timezone tool',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'How do I convert time between timezones?',
    answer:
      'Select the timezones you want to compare. By default the tool shows the current live time across all zones simultaneously. To convert a specific time, use the date/time picker at the top to pin a moment in time.',
  },
  {
    question: 'Does the converter handle Daylight Saving Time?',
    answer:
      'Yes. The tool uses the browser\'s built-in Intl API which automatically applies current DST rules for every timezone. The UTC offset shown updates correctly when DST transitions occur.',
  },
  {
    question: 'What is UTC and why is it used as a reference?',
    answer:
      'UTC (Coordinated Universal Time) is the global time standard with no daylight saving offset. All timezone offsets (like UTC+5:30 for IST or UTC-5 for EST) are expressed relative to UTC. It is the most reliable reference for cross-timezone coordination.',
  },
  {
    question: 'What is the IST to EST time difference?',
    answer:
      'Indian Standard Time (IST) is UTC+5:30. Eastern Standard Time (EST) is UTC-5. The difference is 10 hours 30 minutes — when it is 12:00 noon IST, it is 1:30 AM EST the same day. During US Daylight Saving (EDT, UTC-4), the difference is 9 hours 30 minutes.',
  },
  {
    question: 'Can I add multiple timezones?',
    answer:
      'Yes. Click "Add" to add as many as 10 timezone rows. You can search for any IANA timezone by city or country name.',
  },
];

export default function Page() {
  const tool = getTool('timezone-converter')!;
  const related = getRelatedTools('timezone-converter');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Timezone Converter',
        headline: 'Convert Time Between Any Timezones',
        subheadline:
          'Live clock across all zones. Pin any date and time. DST-aware. All IANA timezones supported.',
      }}
      contentBlocks={[
        {
          title: 'Working across timezones',
          body: (
            <p>
              Remote teams, global meetings, and distributed deployments all require precise
              timezone awareness. Daylight Saving Time shifts mean that a fixed offset like
              &ldquo;New York is UTC-5&rdquo; is only correct for part of the year. This tool always reflects
              the <em>current</em> DST status so you never schedule a meeting an hour off.
            </p>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <TimezoneTool />
    </ToolPageLayout>
  );
}
