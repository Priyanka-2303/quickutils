import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { UUIDTool } from '@/components/uuid-generator/UUIDTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'UUID Generator — Generate v4 UUIDs Online Free',
  description:
    'Generate cryptographically secure v4 UUIDs in bulk. Choose standard, uppercase, no-hyphens or braces format. Validate existing UUIDs. Free, browser-based, no data sent to servers.',
  path: '/uuid-generator',
  keywords: [
    'UUID generator',
    'generate UUID online',
    'UUID v4 generator',
    'GUID generator',
    'random UUID',
    'bulk UUID generator',
    'UUID validator',
    'free UUID generator',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What is a UUID?',
    answer:
      'A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify objects in computer systems. It is represented as a 32-character hexadecimal string split into 5 groups: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Version 4 UUIDs are randomly generated.',
  },
  {
    question: 'Are the generated UUIDs truly unique?',
    answer:
      'UUID v4 uses a cryptographically secure random number generator (crypto.randomUUID in modern browsers). The probability of generating two identical UUIDs is astronomically small — approximately 1 in 5.3 × 10^36 — making collisions practically impossible.',
  },
  {
    question: 'What is the difference between UUID and GUID?',
    answer:
      'UUID and GUID (Globally Unique Identifier) refer to the same concept. UUID is the standard term defined by RFC 4122; GUID is Microsoft\'s term for the same thing.',
  },
  {
    question: 'When should I use UUID v4 vs other versions?',
    answer:
      'Use v4 when you need a completely random ID with no embedded meaning — database primary keys, session tokens, file names. Use v1 (time-based) if you need sortable IDs. Use v5 (name-based SHA-1) if you need deterministic IDs from a namespace and name.',
  },
  {
    question: 'What are the different UUID formats?',
    answer:
      'Standard: 3fa85f64-5717-4562-b3fc-2c963f66afa6. Uppercase: same with capital letters. No hyphens: 32-character hex without dashes. Braces: {3fa85f64-5717-4562-b3fc-2c963f66afa6} — used in some Windows and .NET APIs.',
  },
];

export default function Page() {
  const tool = getTool('uuid-generator')!;
  const related = getRelatedTools('uuid-generator');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'UUID Generator',
        headline: 'Generate Secure v4 UUIDs in Bulk',
        subheadline:
          'Cryptographically secure, multiple formats, inline validator. Everything runs in your browser.',
      }}
      contentBlocks={[
        {
          title: 'What are UUIDs used for?',
          body: (
            <ul>
              <li><strong>Database primary keys</strong> — decentralised ID generation without a sequence.</li>
              <li><strong>API resources</strong> — stable identifiers that don&apos;t expose enumeration.</li>
              <li><strong>Session tokens</strong> — unpredictable identifiers for user sessions.</li>
              <li><strong>File names</strong> — avoid collisions when uploading user content.</li>
              <li><strong>Distributed systems</strong> — generate IDs on any node without coordination.</li>
            </ul>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <UUIDTool />
    </ToolPageLayout>
  );
}
