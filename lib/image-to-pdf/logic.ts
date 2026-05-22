/**
 * Image to PDF — uses pdf-lib (already installed, proven reliable).
 * jsPDF v4 has a broken PNG decoder (fast-png); pdf-lib avoids this entirely.
 */

export type PageSize = 'a4' | 'letter' | 'legal' | 'a3';
export type Orientation = 'portrait' | 'landscape';
export type FitMode = 'fit' | 'fill' | 'original';

export const PAGE_SIZES: { label: string; value: PageSize }[] = [
  { label: 'A4 (210 × 297 mm)', value: 'a4' },
  { label: 'Letter (216 × 279 mm)', value: 'letter' },
  { label: 'Legal (216 × 356 mm)', value: 'legal' },
  { label: 'A3 (297 × 420 mm)', value: 'a3' },
];

export const FIT_MODES: { label: string; value: FitMode; description: string }[] = [
  { label: 'Fit', value: 'fit', description: 'Scale down to fit, preserve aspect ratio' },
  { label: 'Fill', value: 'fill', description: 'Stretch to cover the entire page' },
  { label: 'Original', value: 'original', description: 'Use actual pixel size (may overflow)' },
];

/** Page dimensions in PDF points (1 pt = 1/72 inch) */
const PAGE_DIMS_PT: Record<PageSize, [number, number]> = {
  a4:     [595.28, 841.89],
  letter: [612,    792],
  legal:  [612,    1008],
  a3:     [841.89, 1190.55],
};

export type ImageEntry = {
  id: number;
  file: File;
  name: string;
  objectUrl: string;
  width: number;
  height: number;
};

let _idSeq = 0;
export function mkImageEntry(file: File, width: number, height: number): ImageEntry {
  return {
    id: ++_idSeq,
    file,
    name: file.name,
    objectUrl: URL.createObjectURL(file),
    width,
    height,
  };
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Cannot read image')); };
    img.src = url;
  });
}

/**
 * Convert any image file to JPEG bytes via Canvas.
 * This handles WebP, GIF, BMP, AVIF, etc. that pdf-lib doesn't natively support.
 */
function imageFileToJpegBytes(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      // Fill white so transparent PNGs don't become black on JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Canvas toBlob failed')); return; }
          blob.arrayBuffer()
            .then((ab) => resolve(new Uint8Array(ab)))
            .catch(reject);
        },
        'image/jpeg',
        0.92,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export async function imagesToPdf(
  images: ImageEntry[],
  pageSize: PageSize,
  orientation: Orientation,
  fitMode: FitMode,
  margin: number, // mm
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');

  const pdfDoc = await PDFDocument.create();

  const [baseW, baseH] = PAGE_DIMS_PT[pageSize];
  const [pageW, pageH] =
    orientation === 'landscape' ? [baseH, baseW] : [baseW, baseH];

  // mm → pt  (1 mm = 2.8346 pt)
  const marginPt = margin * 2.8346;

  for (const img of images) {
    let pdfImage;
    const type = img.file.type;

    try {
      if (type === 'image/jpeg' || type === 'image/jpg') {
        const bytes = await img.file.arrayBuffer();
        pdfImage = await pdfDoc.embedJpg(bytes);
      } else if (type === 'image/png') {
        const bytes = await img.file.arrayBuffer();
        pdfImage = await pdfDoc.embedPng(bytes);
      } else {
        // WebP, GIF, BMP, AVIF → convert to JPEG via canvas
        const jpegBytes = await imageFileToJpegBytes(img.file);
        pdfImage = await pdfDoc.embedJpg(jpegBytes);
      }
    } catch {
      // Fallback: force canvas → JPEG conversion even for JPG/PNG if embed fails
      const jpegBytes = await imageFileToJpegBytes(img.file);
      pdfImage = await pdfDoc.embedJpg(jpegBytes);
    }

    const page = pdfDoc.addPage([pageW, pageH]);
    const availW = pageW - marginPt * 2;
    const availH = pageH - marginPt * 2;

    let drawW = availW;
    let drawH = availH;
    let x = marginPt;
    // pdf-lib origin is bottom-left; compute y from top
    let yFromTop = marginPt;

    const imgW = pdfImage.width;
    const imgH = pdfImage.height;

    if (fitMode === 'fit') {
      const imgAspect  = imgW / imgH;
      const pageAspect = availW / availH;
      if (imgAspect > pageAspect) {
        drawW = availW;
        drawH = availW / imgAspect;
        yFromTop = marginPt + (availH - drawH) / 2;
      } else {
        drawH = availH;
        drawW = availH * imgAspect;
        x = marginPt + (availW - drawW) / 2;
      }
    } else if (fitMode === 'original') {
      // 96 dpi screen → points (1 px = 0.75 pt at 96 dpi)
      drawW = imgW * 0.75;
      drawH = imgH * 0.75;
    }
    // 'fill' keeps drawW = availW, drawH = availH (stretches)

    // Convert top-origin y to bottom-origin y for pdf-lib
    const y = pageH - yFromTop - drawH;

    page.drawImage(pdfImage, { x, y, width: drawW, height: drawH });
  }

  return pdfDoc.save();
}
