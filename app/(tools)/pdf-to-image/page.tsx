import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { PdfToImageTool } from '@/components/pdf-to-image/PdfToImageTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'PDF to Image — Convert PDF Pages to PNG or JPEG Free',
  description:
    'Convert each page of a PDF to a high-quality PNG or JPEG image. Select specific pages, choose export scale, and download as a ZIP. Runs in your browser.',
  path: '/pdf-to-image',
  keywords: [
    'pdf to image',
    'pdf to png',
    'pdf to jpg',
    'convert pdf pages to images',
    'extract images from pdf',
    'pdf page screenshot',
    'free pdf to jpeg converter',
    'pdf to picture',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'What resolution are the exported images?',
    answer:
      'Use the scale setting to control resolution. Scale 1× = 72 dpi (screen quality). Scale 2× = 144 dpi (recommended for most uses). Scale 3× = 216 dpi (print-ready). Higher scale means larger file sizes.',
  },
  {
    question: 'Can I convert only specific pages?',
    answer:
      'Yes. After uploading, thumbnails of all pages are shown. Click individual pages to select or deselect them. Use "All" or "None" to quickly select everything or start from scratch.',
  },
  {
    question: 'PNG vs JPEG — which should I choose?',
    answer:
      'PNG is lossless and best for text-heavy documents, diagrams, or slides where sharpness matters. JPEG is smaller and better for PDFs that are mostly photographic. For most documents, PNG at 2× scale is the ideal choice.',
  },
  {
    question: 'Are my PDFs uploaded to a server?',
    answer:
      'No. PDF rendering uses PDF.js running entirely in your browser. Your documents never leave your device.',
  },
  {
    question: 'Why is the first render slow?',
    answer:
      'PDF.js loads a web worker (~1 MB) the first time it runs. Subsequent pages in the same session render much faster. This is a one-time load per browser session.',
  },
];

export default function Page() {
  const tool = getTool('pdf-to-image')!;
  const related = getRelatedTools('pdf-to-image');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'PDF to Image',
        headline: 'Convert PDF Pages to PNG / JPEG',
        subheadline:
          'High-resolution export. Select pages. Download as ZIP. Runs entirely in your browser.',
      }}
      contentBlocks={[
        {
          title: 'Why convert PDF pages to images?',
          body: (
            <p>
              Extracting a page as an image is useful for sharing a single slide, embedding a
              page preview in a presentation, creating thumbnails, or pasting content into a chat
              without sending the whole document. This tool renders each page at the exact
              resolution you need using Mozilla&apos;s PDF.js engine.
            </p>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <PdfToImageTool />
    </ToolPageLayout>
  );
}
