import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { Base64Tool } from '@/components/base64-encoder/Base64Tool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Base64 Encoder / Decoder — Free Online Tool',
  description:
    'Encode and decode Base64 strings instantly in your browser. Supports standard and URL-safe Base64. Free, secure, client-side — no data leaves your device.',
  path: '/base64-encoder',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'base64 encode online',
    'base64 decode online',
    'base64 converter',
    'url safe base64',
    'base64 to text',
    'text to base64',
    'free base64 encoder',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What is Base64 encoding?',
    answer:
      'Base64 is an encoding scheme that converts binary or text data into a string of ASCII characters using 64 printable characters (A–Z, a–z, 0–9, +, /). It is widely used to safely transmit data in URLs, email bodies, HTTP headers, and JSON payloads.',
  },
  {
    question: 'What is the difference between standard and URL-safe Base64?',
    answer:
      'Standard Base64 uses + and / characters which have special meaning in URLs. URL-safe Base64 replaces + with - and / with _, and omits the trailing = padding. Use URL-safe Base64 for JWT tokens, URL parameters, and filenames.',
  },
  {
    question: 'Does Base64 encoding compress data?',
    answer:
      'No. Base64 increases the size of data by approximately 33% because every 3 bytes of input become 4 ASCII characters. It is an encoding scheme for safe transport, not compression.',
  },
  {
    question: 'Is Base64 the same as encryption?',
    answer:
      'No. Base64 is reversible encoding, not encryption. Anyone can decode a Base64 string without a key. Do not use Base64 to secure sensitive data — use proper encryption algorithms instead.',
  },
  {
    question: 'How can I tell if a string is Base64 encoded?',
    answer:
      'Base64 strings only contain A–Z, a–z, 0–9, +, and / (or - and _ for URL-safe), and are usually padded with = at the end. Use the Auto-detect button in this tool to automatically pick the correct mode.',
  },
  {
    question: 'Is this Base64 tool secure?',
    answer:
      'Yes. Encoding and decoding use the browser\'s native btoa() and atob() Web APIs. Your data is never transmitted to any server.',
  },
];

export default function Page() {
  const tool = getTool('base64-encoder')!;
  const related = getRelatedTools('base64-encoder');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Base64 Encoder / Decoder',
        headline: 'Encode & Decode Base64 Instantly',
        subheadline:
          'Standard and URL-safe Base64. Auto-detects encode vs decode. Runs entirely in your browser.',
      }}
      contentBlocks={[
        {
          title: 'What is Base64 and when do you need it?',
          body: (
            <>
              <p>
                Base64 encoding converts arbitrary data into a safe ASCII string. It appears
                everywhere in web development: JWT tokens, data URIs, HTTP Basic Auth headers,
                email attachments (MIME), and API payloads that need to carry binary data as text.
              </p>
              <p>
                <strong>URL-safe Base64</strong> is a variant that replaces the{' '}
                <code>+</code> and <code>/</code> characters with <code>-</code> and{' '}
                <code>_</code>, making the encoded string safe to include in URLs and filenames
                without percent-encoding.
              </p>
            </>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <Base64Tool />
    </ToolPageLayout>
  );
}
