import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { JsonFormatterTool } from '@/components/json-formatter/JsonFormatterTool';
import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import type { FAQ } from '@/lib/seo/jsonld';

const TOOL_SLUG = 'json-formatter';

export const metadata = buildMetadata({
  title: 'JSON Formatter — Format, Validate & Minify JSON Online',
  description:
    'Free online JSON formatter, validator, and minifier. Beautify JSON instantly in your browser with syntax highlighting and error detection. No data leaves your device.',
  path: `/${TOOL_SLUG}`,
  keywords: [
    'JSON formatter',
    'JSON beautifier',
    'JSON validator',
    'format JSON online',
    'minify JSON',
    'pretty print JSON',
    'JSON parser online',
    'fix invalid JSON',
    'free JSON formatter',
    'browser JSON formatter',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What is JSON formatting?',
    answer:
      'JSON formatting (also called beautifying or pretty-printing) adds consistent indentation and line breaks to a JSON document so humans can read it. The data is unchanged — only whitespace is added.',
  },
  {
    question: 'How do I validate JSON online?',
    answer:
      'Paste your JSON into the input editor and click Validate. The formatter checks syntax against the JSON specification (RFC 8259) and reports the exact line and column of any error.',
  },
  {
    question: 'Is this JSON formatter secure?',
    answer:
      'Yes. The entire formatter runs locally in your browser using JavaScript\'s built-in JSON parser. Your JSON is never sent to a server, logged, or stored anywhere.',
  },
  {
    question: 'Does this tool store uploaded JSON?',
    answer:
      'No. Uploaded files are read directly into the browser using the FileReader API. We have no backend that could receive your data.',
  },
  {
    question: 'How do I fix invalid JSON?',
    answer:
      'Common JSON errors include trailing commas, single quotes instead of double quotes, unquoted property names, and unescaped special characters. The validator shows the line and column of the first parse error so you can locate it quickly.',
  },
  {
    question: 'What is the difference between formatting and minifying JSON?',
    answer:
      'Formatting adds whitespace for readability; minifying removes all unnecessary whitespace to shrink the payload. Use minified JSON for production APIs and formatted JSON for debugging.',
  },
  {
    question: 'How large a file can I format?',
    answer:
      'You can paste arbitrary JSON, and uploaded files up to 5 MB are supported. Very large files may run slowly because the entire document is held in memory by the editor.',
  },
];

export default function Page() {
  const tool = getTool(TOOL_SLUG)!;
  const related = getRelatedTools(TOOL_SLUG);

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'JSON Formatter',
        headline: 'Format, Validate & Minify JSON Instantly',
        subheadline:
          'Free online JSON formatter and validator. Fast, secure, browser-based, and developer friendly.',
      }}
      contentBlocks={[
        {
          title: 'What is a JSON formatter?',
          body: (
            <>
              <p>
                A JSON formatter takes raw, often-minified JSON and makes it readable by adding
                indentation, line breaks, and consistent spacing. JSON (JavaScript Object Notation)
                is the standard data format used by virtually every modern API, configuration file,
                and log pipeline — but it is also notoriously easy to break with a single misplaced
                comma.
              </p>
              <p>
                <strong>{`QuickUtils' JSON formatter`}</strong> beautifies, validates, and minifies
                JSON entirely in your browser. There is no server round-trip, no signup, and no
                tracking of the data you paste.
              </p>
            </>
          ),
        },
        {
          title: 'How to use the JSON formatter',
          body: (
            <ol>
              <li>
                <strong>Paste or upload your JSON.</strong> Drop a file into the input pane or click
                Upload — anything up to 5 MB works.
              </li>
              <li>
                <strong>Pick an indent size.</strong> 2 spaces is the most common style; tabs and 4
                spaces are also available.
              </li>
              <li>
                <strong>Click Format.</strong> The formatted result appears in the right pane with
                syntax highlighting.
              </li>
              <li>
                <strong>Copy or download.</strong> Copy to clipboard or save as{' '}
                <code>formatted.json</code> with one click.
              </li>
              <li>
                <strong>Validate or minify</strong> using the toolbar to check syntax or strip
                whitespace.
              </li>
            </ol>
          ),
        },
        {
          title: 'Why use QuickUtils for JSON?',
          body: (
            <ul>
              <li>
                <strong>100% client-side.</strong> Your data never leaves your machine — important
                when you are working with API responses that may contain credentials or PII.
              </li>
              <li>
                <strong>Precise error messages.</strong> When parsing fails, the validator points to
                the exact line and column instead of returning a generic “Invalid JSON.”
              </li>
              <li>
                <strong>Built on Monaco.</strong> The same editor that powers VS Code — keyboard
                shortcuts, smart indentation, and find/replace all work as you would expect.
              </li>
              <li>
                <strong>No popups, no signups.</strong> Open the page, paste, format. That is the
                whole flow.
              </li>
            </ul>
          ),
        },
      ]}
      howToSteps={[
        { name: 'Paste or upload your JSON', text: 'Paste raw or minified JSON into the editor, or click Upload to open a .json file. Files up to 5 MB are supported.' },
        { name: 'Click Format or Validate', text: 'Click Format to beautify with syntax highlighting, or Validate to check for errors. The exact line and column of any syntax error is highlighted.' },
        { name: 'Copy or download the result', text: 'Click Copy to copy the formatted JSON to your clipboard, or Download to save it as a .json file. Your data never leaves your browser.' },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <JsonFormatterTool />
    </ToolPageLayout>
  );
}
