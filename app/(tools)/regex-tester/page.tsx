import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { RegexTool } from '@/components/regex-tester/RegexTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Regex Tester — Test Regular Expressions Online Free',
  description:
    'Test and debug regular expressions with live match highlighting. Supports global, case-insensitive, multiline, dotAll flags, named groups, and replace. Free, browser-based.',
  path: '/regex-tester',
  keywords: [
    'regex tester',
    'regular expression tester',
    'regex online',
    'regex checker',
    'regex validator',
    'test regex online',
    'regex match highlighter',
    'javascript regex tester',
    'free regex tester',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What regex flavour does this tester use?',
    answer:
      'This tool uses JavaScript\'s native RegExp engine, which supports standard features including character classes, quantifiers, groups, lookaheads, lookbehinds, named capture groups, and Unicode properties.',
  },
  {
    question: 'What do the flags mean?',
    answer:
      'g (global) finds all matches instead of stopping at the first. i (case-insensitive) makes the match ignore letter case. m (multiline) makes ^ and $ match the start and end of each line. s (dotAll) makes the dot . match newline characters too.',
  },
  {
    question: 'How do I use named capture groups?',
    answer:
      'Use the (?<name>...) syntax. For example, (?<year>\\d{4})-(?<month>\\d{2}) captures year and month as named groups. The tool displays captured group values in the Named Groups panel.',
  },
  {
    question: 'How does replace work?',
    answer:
      'Enter a replacement string in the Replace field. Use $1, $2 etc. to insert numbered capture groups, or $<name> for named groups. The replaced result is shown live below the input.',
  },
  {
    question: 'Why is my regex matching too much?',
    answer:
      'Greedy quantifiers (*, +, ?) match as many characters as possible. Use lazy versions (*?, +?, ??) to match as few as possible. Use anchors (^ and $) and word boundaries (\\b) to be more precise.',
  },
  {
    question: 'Is this tool safe for sensitive text?',
    answer:
      'Yes. The regex engine runs entirely in your browser using JavaScript. Your test string is never sent to any server.',
  },
];

export default function Page() {
  const tool = getTool('regex-tester')!;
  const related = getRelatedTools('regex-tester');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Regex Tester',
        headline: 'Test Regular Expressions with Live Highlighting',
        subheadline:
          'Match highlighting, named groups, replace preview, and common pattern shortcuts — all in your browser.',
      }}
      contentBlocks={[
        {
          title: 'How to use the regex tester',
          body: (
            <ol>
              <li>Enter your regular expression in the pattern bar at the top.</li>
              <li>Toggle flags (g, i, m, s) using the buttons next to the pattern.</li>
              <li>Paste your test string or use the built-in sample text.</li>
              <li>Matches are highlighted in yellow in real time.</li>
              <li>Optionally enter a replacement string to preview substitutions.</li>
            </ol>
          ),
        },
        {
          title: 'Common regex patterns',
          body: (
            <ul>
              <li><strong>Email:</strong> <code>[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{'{2,}'}</code></li>
              <li><strong>URL:</strong> <code>https?://[^\s]+</code></li>
              <li><strong>IPv4:</strong> <code>\b(?:\d{'{1,3}'}\.){'{3}'}\d{'{1,3}'}\b</code></li>
              <li><strong>Date (YYYY-MM-DD):</strong> <code>\d{'{4}'}-\d{'{2}'}-\d{'{2}'}</code></li>
              <li><strong>Hex colour:</strong> <code>#(?:[0-9a-fA-F]{'{3}'}){'{1,2}'}\b</code></li>
            </ul>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <RegexTool />
    </ToolPageLayout>
  );
}
