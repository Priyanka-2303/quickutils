/**
 * PDF to Image — uses pdfjs-dist (dynamically imported).
 * Renders each PDF page to a canvas and exports as PNG / JPEG.
 */

export type ExportFormat = 'png' | 'jpeg';
export type ExportScale = 1 | 1.5 | 2 | 3;

export const SCALE_OPTIONS: { label: string; value: ExportScale }[] = [
  { label: '1× (72 dpi)', value: 1 },
  { label: '1.5× (108 dpi)', value: 1.5 },
  { label: '2× (144 dpi) — recommended', value: 2 },
  { label: '3× (216 dpi) — high quality', value: 3 },
];

export type PagePreview = {
  pageNumber: number; // 1-based
  dataUrl: string;    // thumbnail (scale 0.3)
  width: number;
  height: number;
};

/** Renders all pages as low-res thumbnails for the preview grid */
export async function renderThumbnails(file: File): Promise<PagePreview[]> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const bytes = await file.arrayBuffer();
  const pdf   = await pdfjsLib.getDocument({ data: bytes }).promise;
  const previews: PagePreview[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page     = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.3 });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    previews.push({
      pageNumber: i,
      dataUrl:    canvas.toDataURL('image/jpeg', 0.7),
      width:      Math.round(viewport.width / 0.3),
      height:     Math.round(viewport.height / 0.3),
    });
  }

  return previews;
}

/** Renders selected pages at full quality and returns their data URLs */
export async function renderPages(
  file: File,
  pageNumbers: number[], // 1-based
  scale: ExportScale,
  format: ExportFormat,
  onProgress?: (pct: number) => void,
): Promise<{ pageNumber: number; dataUrl: string }[]> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const bytes   = await file.arrayBuffer();
  const pdf     = await pdfjsLib.getDocument({ data: bytes }).promise;
  const results: { pageNumber: number; dataUrl: string }[] = [];
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality  = format === 'jpeg' ? 0.92 : 1;

  for (let idx = 0; idx < pageNumbers.length; idx++) {
    const num      = pageNumbers[idx];
    const page     = await pdf.getPage(num);
    const viewport = page.getViewport({ scale });
    const canvas   = document.createElement('canvas');
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    results.push({ pageNumber: num, dataUrl: canvas.toDataURL(mimeType, quality) });
    onProgress?.(Math.round(((idx + 1) / pageNumbers.length) * 100));
  }

  return results;
}

/** Download all rendered pages as a ZIP file */
export async function downloadAsZip(
  pages: { pageNumber: number; dataUrl: string }[],
  baseName: string,
  format: ExportFormat,
): Promise<void> {
  const JSZip     = (await import('jszip')).default;
  const zip       = new JSZip();
  const ext       = format === 'png' ? 'png' : 'jpg';

  for (const { pageNumber, dataUrl } of pages) {
    const base64 = dataUrl.split(',')[1];
    zip.file(`${baseName}_page${String(pageNumber).padStart(3, '0')}.${ext}`, base64, {
      base64: true,
    });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${baseName}_images.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Download a single page image */
export function downloadPage(
  dataUrl: string,
  pageNumber: number,
  baseName: string,
  format: ExportFormat,
): void {
  const ext = format === 'png' ? 'png' : 'jpg';
  const a   = document.createElement('a');
  a.href    = dataUrl;
  a.download = `${baseName}_page${String(pageNumber).padStart(3, '0')}.${ext}`;
  a.click();
}
