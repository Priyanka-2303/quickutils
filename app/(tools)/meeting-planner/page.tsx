import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { MeetingTool } from '@/components/meeting-planner/MeetingTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Meeting Planner — Find the Best Time Across Timezones',
  description:
    'Visually find the best meeting time across multiple timezones. Business-hours overlap highlighted, night hours dimmed. DST-aware. Free, browser-based.',
  path: '/meeting-planner',
  keywords: [
    'meeting planner',
    'meeting time across timezones',
    'world meeting scheduler',
    'timezone overlap finder',
    'best time to meet remotely',
    'global meeting tool',
    'IST EST meeting time',
    'remote team meeting planner',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'How does the meeting planner work?',
    answer:
      'Add the timezones of your meeting participants and pick a date. The planner renders a 24-hour grid for each zone and highlights hours where everyone falls within business hours (09:00–18:00 local). Click any highlighted slot to see the exact local time for each participant.',
  },
  {
    question: 'What does "best overlap" mean?',
    answer:
      'Best overlap (shown in green) means ALL participants are within their 09:00–18:00 working window at that UTC hour. Amber slots indicate that everyone is awake but at least one person is outside normal working hours. Grey/dimmed slots mean someone is in the middle of the night.',
  },
  {
    question: 'Does it handle Daylight Saving Time?',
    answer:
      'Yes. Every offset is computed fresh for the specific date you choose using the browser\'s Intl API. If you pick a date after a DST transition the offsets update automatically.',
  },
  {
    question: 'Can I add more than three timezones?',
    answer:
      'Yes — click "Add timezone" to add up to 8 timezone rows. You can search for any IANA timezone by city or region name.',
  },
  {
    question: 'Why does a "+1d" or "−1d" badge appear on some cells?',
    answer:
      'It means that UTC hour falls on a different calendar day in that timezone. For example, 23:00 UTC on Monday is Tuesday morning in Asia/Tokyo. The badge prevents confusion when scheduling across the date line.',
  },
];

export default function Page() {
  const tool = getTool('meeting-planner')!;
  const related = getRelatedTools('meeting-planner');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Meeting Planner',
        headline: 'Find the Best Meeting Time Across Timezones',
        subheadline:
          'Visual 24-hour grid. Business-hours overlap highlighted. DST-aware. Up to 8 timezones.',
      }}
      contentBlocks={[
        {
          title: 'Scheduling across timezones',
          body: (
            <p>
              Remote teams, cross-border clients, and distributed open-source projects all need a
              quick way to answer &ldquo;what time works for everyone?&rdquo; Manually calculating
              offsets, remembering which regions are currently on DST, and avoiding the{' '}
              <em>accidentally-scheduled-at-2am</em> mistake is error-prone. This tool makes the
              overlap immediately visible — green means everyone is at their desk.
            </p>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <MeetingTool />
    </ToolPageLayout>
  );
}
