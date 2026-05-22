import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { CompressTool } from '@/components/compress-image/CompressTool';
import type { FAQ } from '@/lib/seo/jsonld';

export const metadata = buildMetadata({
  title: 'Compress Image Online Free — Reduce JPEG, PNG & WebP Size',
  description:
    'Compress images online for free — JPEG, PNG, WebP, GIF. Reduce file size by up to 90% without visible quality loss. Runs entirely in your browser, no uploads, no signup.',
  path: '/compress-image',
  keywords: [
    'compress image online free',
    'reduce image size online',
    'image compressor',
    'jpeg compressor online',
    'png compressor online',
    'webp compressor',
    'reduce photo size without losing quality',
    'image optimizer free',
    'compress image for web',
    'reduce image file size',
    'squoosh alternative',
    'tinypng alternative free',
  ],
});

const faqs: FAQ[] = [
  {
    question: 'Is my image uploaded to a server?',
    answer:
      'No. The entire compression happens inside your browser using a web worker. Your images never leave your device. This makes it safe for sensitive or private photos.',
  },
  {
    question: 'What image formats are supported?',
    answer:
      'JPEG, PNG, WebP, GIF, and BMP. The output format matches the input — a JPEG in gives a JPEG out.',
  },
  {
    question: 'What does the Quality slider do?',
    answer:
      'Lower quality values produce smaller files with more visible compression artifacts. Values around 70–85% usually give the best size-to-quality trade-off for photos. For graphics with sharp edges (logos, screenshots), stay above 85%.',
  },
  {
    question: 'What does Max dimension do?',
    answer:
      'It caps the longest side of the image in pixels. An 8000×6000 photo capped at 1920px will be scaled down proportionally to fit within 1920px on its longest side. This is independent of quality.',
  },
  {
    question: 'Why is there no size reduction for some PNG files?',
    answer:
      'PNGs with very few colors or that are already optimally compressed may not reduce further. PNG compression is lossless by nature — to get significant savings on PNGs, lower the max dimension or switch to JPEG/WebP for photographic images.',
  },
];

export default function Page() {
  const tool = getTool('compress-image')!;
  const related = getRelatedTools('compress-image');

  return (
    <ToolPageLayout
      tool={tool}
      hero={{
        eyebrow: 'Image Compressor',
        headline: 'Compress Images Instantly',
        subheadline:
          'Reduce file size while preserving quality. JPEG, PNG, WebP. Runs entirely in your browser.',
      }}
      contentBlocks={[
        {
          title: 'Why image compression matters',
          body: (
            <p>
              Large images are one of the biggest culprits of slow web pages and storage bloat.
              A 5 MB photo from a modern camera can usually be reduced to under 500 KB with no
              visible quality loss. This tool applies perceptual compression — the algorithm
              discards information your eye is least likely to notice.
            </p>
          ),
        },
      ]}
      howToSteps={[
        { name: 'Drop or select your image', text: 'Drag and drop a JPEG, PNG, WebP, GIF or BMP image onto the upload zone, or click to browse. No size limit is enforced.' },
        { name: 'Adjust quality and max dimension', text: 'Use the Quality slider (70–85% is usually ideal for photos) and set a Max Dimension to scale down large images from modern cameras.' },
        { name: 'Download the compressed image', text: 'Click Compress and then Download. The tool shows you exactly how many KB/MB were saved and the percentage reduction.' },
      ]}
      faqs={faqs}
      relatedTools={related}
    >
      <CompressTool />
    </ToolPageLayout>
  );
}
