/**
 * PDF Merge — uses pdf-lib (dynamically imported).
 * Merges multiple PDF files into one, preserving all pages.
 */

export type PdfEntry = {
  id: number;
  file: File;
  name: string;
  pageCount: number | null; // null while loading
  sizeBytes: number;
};

let _seq = 0;
export function mkPdfEntry(file: File): PdfEntry {
  return {
    id: ++_seq,
    file,
    name: file.name,
    pageCount: null,
    sizeBytes: file.size,
  };
}

export async function readPageCount(file: File): Promise<number> {
  const { PDFDocument } = await import('pdf-lib');
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function mergePdfs(
  entries: PdfEntry[],
  onProgress?: (pct: number) => void,
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const merged = await PDFDocument.create();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const bytes = await entry.file.arrayBuffer();
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
    onProgress?.(Math.round(((i + 1) / entries.length) * 100));
  }

  return merged.save();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
