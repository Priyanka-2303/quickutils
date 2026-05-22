/**
 * Image to PDF — uses jsPDF (dynamically imported).
 * Converts one or more images into a single PDF document.
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
  { label: 'Fill', value: 'fill', description: 'Stretch/crop to fill the page' },
  { label: 'Original', value: 'original', description: 'Use actual pixel size (may overflow)' },
];

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
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function imagesToPdf(
  images: ImageEntry[],
  pageSize: PageSize,
  orientation: Orientation,
  fitMode: FitMode,
  margin: number, // mm
): Promise<Uint8Array> {
  const { jsPDF } = await import('jspdf');

  let pdf: InstanceType<typeof jsPDF> | null = null;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];

    // Read file as data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(img.file);
    });

    const format = img.file.type === 'image/png' ? 'PNG' : 'JPEG';

    if (i === 0) {
      pdf = new jsPDF({ orientation, format: pageSize, unit: 'mm' });
    } else {
      pdf!.addPage(pageSize, orientation);
    }

    const pageW = pdf!.internal.pageSize.getWidth();
    const pageH = pdf!.internal.pageSize.getHeight();
    const availW = pageW - margin * 2;
    const availH = pageH - margin * 2;

    let x = margin;
    let y = margin;
    let drawW = availW;
    let drawH = availH;

    if (fitMode === 'fit') {
      const imgAspect = img.width / img.height;
      const pageAspect = availW / availH;
      if (imgAspect > pageAspect) {
        drawW = availW;
        drawH = availW / imgAspect;
        y = margin + (availH - drawH) / 2;
      } else {
        drawH = availH;
        drawW = availH * imgAspect;
        x = margin + (availW - drawW) / 2;
      }
    } else if (fitMode === 'original') {
      // Convert px to mm (96 dpi → mm)
      drawW = (img.width / 96) * 25.4;
      drawH = (img.height / 96) * 25.4;
    }

    pdf!.addImage(dataUrl, format, x, y, drawW, drawH);
  }

  return pdf!.output('arraybuffer') as unknown as Uint8Array;
}
