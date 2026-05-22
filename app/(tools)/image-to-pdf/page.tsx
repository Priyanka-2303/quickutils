import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { ImageToPdfTool } from '@/components/image-to-pdf/ImageToPdfTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Image to PDF — Convert Images to PDF Free Online',
  description:
    'Convert one or more images (JPEG, PNG, WebP) into a single PDF. Choose page size, orientation, and fit mode. All processing in the browser — no uploads.',
  path: '/image-to-pdf',
  keywords: [
    'image to pdf',
    'jpg to pdf',
    'png to pdf',
    'convert images to pdf',
    'photos to pdf online',
    'multiple images to pdf',
    'free image to pdf converter',
    'jpeg to pdf',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'Can I convert multiple images into one PDF?',
    answer:
      'Yes. Upload as many images as you like and reorder them using the up/down arrows. Each image becomes one page in the PDF in the order shown.',
  },
  {
    question: 'What page sizes are available?',
    answer:
      'A4 (210 × 297 mm), US Letter (216 × 279 mm), Legal (216 × 356 mm), and A3 (297 × 420 mm). You can also switch between portrait and landscape orientation.',
  },
  {
    question: 'What does Fit mode do?',
    answer:
      'Fit scales the image down to fill the page while preserving aspect ratio, with white margins. Fill stretches it to cover the entire page. Original uses the actual pixel size converted to millimetres at 96 dpi.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer:
      'No. The PDF is generated entirely in your browser using jsPDF. Your images are never sent anywhere.',
  },
];

export default function Page() {
  const tool = getTool('image-to-pdf')!;
  const related = getRelatedTools('image-to-pdf');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Image to PDF',
        headline: 'Convert Images to PDF Instantly',
        subheadline:
          'Multiple images. Custom page size. Portrait or landscape. Download in seconds.',
      }}
      contentBlocks={[
        {
          title: 'When to convert images to PDF',
          body: (
            <p>
              Scanning documents, submitting photo collages, sharing product images with clients —
              PDF is the universal format for multi-page documents. This tool lets you combine any
              number of images into a single PDF file without installing software, creating an
              account, or uploading anything to a server.
            </p>
          ),
        },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <ImageToPdfTool />
    </ToolPageLayout>
  );
}
