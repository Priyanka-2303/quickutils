import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { PdfMergeTool } from '@/components/pdf-merge/PdfMergeTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'PDF Merge — Combine Multiple PDFs into One Free Online',
  description:
    'Merge two or more PDF files into a single document. Drag to reorder pages. All processing in your browser — PDFs are never uploaded.',
  path: '/pdf-merge',
  keywords: [
    'pdf merge',
    'combine pdf files',
    'merge pdf online',
    'join pdf',
    'pdf combiner',
    'merge multiple pdfs',
    'free pdf merger',
    'pdf concatenate',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'How many PDFs can I merge at once?',
    answer:
      'There is no hard limit. However, very large PDFs (hundreds of pages each) may take a few seconds to process since everything runs in your browser without any server acceleration.',
  },
  {
    question: 'Does PDF Merge support password-protected PDFs?',
    answer:
      'The tool attempts to open password-protected PDFs but currently does not support entering passwords. Remove the password protection first using Adobe Acrobat or another tool, then merge.',
  },
  {
    question: 'Are my PDFs sent to a server?',
    answer:
      'No. Everything runs locally in your browser using pdf-lib. Your documents never leave your device.',
  },
  {
    question: 'Will the merged PDF preserve links and bookmarks?',
    answer:
      'Page content, text, images, and vector graphics are preserved. Bookmarks (outlines) and interactive form fields may not be carried over in all cases, as they require special handling in the merge process.',
  },
];

export default function Page() {
  const tool = getTool('pdf-merge')!;
  const related = getRelatedTools('pdf-merge');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'PDF Merger',
        headline: 'Merge PDFs into One Document',
        subheadline:
          'Upload multiple PDFs, reorder them, and download the combined file. No account needed.',
      }}
      contentBlocks={[
        {
          title: 'When you need to combine PDFs',
          body: (
            <p>
              Invoices scanned page by page, a report split across multiple exports, or a
              contract you need to assemble from separate sections — merging PDFs is a common
              daily task. This tool handles it entirely in the browser so sensitive documents
              never touch an external server.
            </p>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <PdfMergeTool />
    </ToolPageLayout>
  );
}
