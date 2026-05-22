/**
 * Compress Image — thin wrapper around browser-image-compression.
 * All processing happens in a web worker inside the library; no data leaves the browser.
 */

export type CompressOptions = {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  quality: number; // 0–1
  onProgress?: (pct: number) => void;
};

export type CompressResult = {
  file: File;
  originalSize: number;
  compressedSize: number;
  savingsPct: number;
  objectUrl: string;
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
];

export function isAcceptedImage(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
}

export async function compressImage(
  file: File,
  opts: CompressOptions,
): Promise<CompressResult> {
  const imageCompression = (await import('browser-image-compression')).default;

  const compressed = await imageCompression(file, {
    maxSizeMB: opts.maxSizeMB,
    maxWidthOrHeight: opts.maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: opts.quality,
    onProgress: opts.onProgress,
  });

  const originalSize = file.size;
  const compressedSize = compressed.size;
  const savingsPct = Math.round(((originalSize - compressedSize) / originalSize) * 100);
  const objectUrl = URL.createObjectURL(compressed);

  return { file: compressed, originalSize, compressedSize, savingsPct, objectUrl };
}
