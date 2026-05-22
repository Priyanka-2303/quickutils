import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { JsonValidatorTool } from '@/components/json-validator/JsonValidatorTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'JSON Validator — Check & Verify JSON Online Free',
  description:
    'Validate JSON syntax instantly in your browser. Get precise error messages with line and column numbers. Free, secure, client-side JSON validator — no data leaves your device.',
  path: '/json-validator',
  keywords: [
    'JSON validator',
    'validate JSON online',
    'JSON syntax checker',
    'check JSON online',
    'JSON lint',
    'JSON error checker',
    'free JSON validator',
    'online JSON checker',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What is JSON validation?',
    answer:
      'JSON validation checks whether a string conforms to the JSON specification (RFC 8259). A valid JSON document uses double-quoted strings, correct bracket/brace matching, proper comma placement, and no trailing commas or comments.',
  },
  {
    question: 'What are the most common JSON errors?',
    answer:
      'The most frequent JSON errors are: trailing commas after the last item in an array or object, single-quoted strings instead of double quotes, unquoted property names, missing commas between items, and unescaped special characters inside strings.',
  },
  {
    question: 'How do I fix "Unexpected token" in JSON?',
    answer:
      'An "Unexpected token" error usually means there is a character at a specific position that the JSON parser did not expect — a trailing comma, an unquoted key, a JavaScript comment, or a single-quoted string. Look at the line number shown in the error and check the character immediately before or after that position.',
  },
  {
    question: 'Is this JSON validator secure?',
    answer:
      'Yes. The validator uses the browser\'s built-in JSON.parse() function. Your JSON is processed entirely in JavaScript on your device and is never transmitted to any server.',
  },
  {
    question: 'What is the difference between JSON validation and JSON schema validation?',
    answer:
      'JSON syntax validation checks that a document is well-formed JSON (correct syntax). JSON Schema validation additionally checks that the data matches a defined structure — types, required fields, allowed values. This tool performs syntax validation.',
  },
  {
    question: 'Can I validate a large JSON file?',
    answer:
      'You can paste or upload JSON files up to 5 MB. Very large documents may take a moment as the Monaco editor loads the content. The validator itself is near-instant for any size.',
  },
];

export default function Page() {
  const tool = getTool('json-validator')!;
  const related = getRelatedTools('json-validator');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'JSON Validator',
        headline: 'Validate JSON Instantly — Precise Error Detection',
        subheadline:
          'Catch syntax errors with exact line numbers. Free, secure, and fully browser-based.',
      }}
      contentBlocks={[
        {
          title: 'What is a JSON validator?',
          body: (
            <>
              <p>
                A JSON validator checks whether a document follows the JSON specification. Even a
                single misplaced comma or unquoted key will cause parsers to reject the document,
                leading to silent failures in production APIs.
              </p>
              <p>
                This validator uses the browser&apos;s built-in{' '}
                <code>JSON.parse()</code> and reports the exact line where parsing failed — so you
                can fix the error in seconds rather than scanning thousands of lines manually.
              </p>
            </>
          ),
        },
        {
          title: 'Common JSON errors and how to fix them',
          body: (
            <ul>
              <li>
                <strong>Trailing comma</strong> — <code>{`{"a":1,}`}</code> is invalid. Remove
                the comma after the last item.
              </li>
              <li>
                <strong>Single quotes</strong> — JSON requires double quotes:{' '}
                <code>{`{"key":"value"}`}</code>, not <code>{`{'key':'value'}`}</code>.
              </li>
              <li>
                <strong>Unquoted keys</strong> — <code>{`{key: "value"}`}</code> is JavaScript
                syntax, not JSON. Keys must be quoted.
              </li>
              <li>
                <strong>Comments</strong> — JSON does not support <code>{'// comments'}</code> or{' '}
                <code>{'/* block comments */'}</code>. Strip them before validating.
              </li>
              <li>
                <strong>Missing comma</strong> — Each item in an array or object must be followed
                by a comma, except the last one.
              </li>
            </ul>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <JsonValidatorTool />
    </ToolPageLayout>
  );
}
