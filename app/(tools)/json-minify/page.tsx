import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { JsonMinifyTool } from '@/components/json-minify/JsonMinifyTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'JSON Minifier — Minify & Compress JSON Online Free',
  description:
    'Minify and compress JSON instantly in your browser. Remove whitespace to shrink payload size for APIs and production use. Free, secure, client-side JSON minifier.',
  path: '/json-minify',
  keywords: [
    'JSON minifier',
    'minify JSON online',
    'compress JSON',
    'JSON minify tool',
    'reduce JSON size',
    'strip JSON whitespace',
    'JSON compressor',
    'minify JSON free',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What does minifying JSON do?',
    answer:
      'Minifying JSON removes all unnecessary whitespace — spaces, tabs, and newlines — that are used only for human readability. The resulting JSON is functionally identical but much smaller in size.',
  },
  {
    question: 'Why should I minify JSON for production?',
    answer:
      'Smaller JSON payloads mean faster API responses, lower bandwidth costs, and better performance for mobile users. A well-structured JSON document can shrink by 30–60% after minification.',
  },
  {
    question: 'Does minifying JSON change the data?',
    answer:
      'No. Minification only removes whitespace. All keys, values, arrays, and nested objects remain exactly the same. Any JSON parser will produce the same result from minified or formatted JSON.',
  },
  {
    question: 'What is the difference between minify and beautify?',
    answer:
      'Minify removes whitespace to make JSON as compact as possible for machines. Beautify (or "pretty print") adds indentation and line breaks to make JSON readable for humans. This tool does both.',
  },
  {
    question: 'Is minified JSON valid JSON?',
    answer:
      'Yes. Whitespace is insignificant in JSON syntax. Minified JSON is fully valid and can be parsed by any standards-compliant JSON parser.',
  },
];

export default function Page() {
  const tool = getTool('json-minify')!;
  const related = getRelatedTools('json-minify');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'JSON Minifier',
        headline: 'Minify & Compress JSON in One Click',
        subheadline:
          'Strip whitespace to shrink payload size for APIs and production. Beautify back anytime.',
      }}
      contentBlocks={[
        {
          title: 'Why minify JSON?',
          body: (
            <>
              <p>
                Formatted JSON is great for development but wasteful in production. A typical API
                response with 2-space indentation carries 20–40% extra bytes that add up fast at
                scale. Minifying strips those bytes before your server sends the response.
              </p>
              <p>
                This tool also lets you <strong>beautify</strong> minified JSON — useful when you
                receive a compressed API response and need to inspect it.
              </p>
            </>
          ),
        },
        {
          title: 'How to minify JSON',
          body: (
            <ol>
              <li>Paste your JSON or upload a <code>.json</code> file.</li>
              <li>Click <strong>Minify</strong> to remove all whitespace.</li>
              <li>The status bar shows exactly how many bytes were saved.</li>
              <li>Click <strong>Copy</strong> or <strong>Download</strong> to use it.</li>
              <li>Click <strong>Beautify</strong> at any time to re-add indentation.</li>
            </ol>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <JsonMinifyTool />
    </ToolPageLayout>
  );
}
