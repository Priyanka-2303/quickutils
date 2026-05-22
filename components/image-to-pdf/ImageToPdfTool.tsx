'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, ChevronUp, ChevronDown, FileDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  mkImageEntry,
  getImageDimensions,
  imagesToPdf,
  PAGE_SIZES,
  FIT_MODES,
  type ImageEntry,
  type PageSize,
  type Orientation,
  type FitMode,
} from '@/lib/image-to-pdf/logic';
import { cn } from '@/lib/utils';

export function ImageToPdfTool() {
  const [images, setImages]   = useState<ImageEntry[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [fitMode, setFitMode] = useState<FitMode>('fit');
  const [margin, setMargin]   = useState(10);
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!accepted.length) return;
    const entries: ImageEntry[] = [];
    for (const f of accepted) {
      try {
        const { width, height } = await getImageDimensions(f);
        entries.push(mkImageEntry(f, width, height));
      } catch {
        // skip unreadable images
      }
    }
    setImages((prev) => [...prev, ...entries]);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const remove = (id: number) => setImages((p) => p.filter((x) => x.id !== id));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setImages((p) => {
      const arr = [...p];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const moveDown = (idx: number) => {
    setImages((p) => {
      if (idx >= p.length - 1) return p;
      const arr = [...p];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
  };

  const generate = async () => {
    if (!images.length) return;
    setBusy(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(images, pageSize, orientation, fitMode, margin);
      const blob  = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href      = url;
      a.download  = 'images.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('PDF generation failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
        />
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Drop images here or click to browse</p>
          <p className="text-sm text-muted-foreground">JPEG, PNG, WebP — multiple files supported</p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{images.length} image{images.length !== 1 ? 's' : ''}</h3>
            <Button variant="ghost" size="sm" onClick={() => setImages([])} className="gap-1.5 text-destructive">
              <RotateCcw className="h-3.5 w-3.5" /> Clear all
            </Button>
          </div>
          <AnimatePresence initial={false}>
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-3 rounded-xl border bg-card p-2 shadow-sm"
              >
                <span className="w-5 text-center text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.objectUrl}
                  alt={img.name}
                  className="h-12 w-12 rounded-md object-cover border bg-muted/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{img.name}</p>
                  <p className="text-xs text-muted-foreground">{img.width} × {img.height}px</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Move up">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveDown(i)} disabled={i === images.length - 1} aria-label="Move down">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(img.id)} aria-label="Remove">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Settings + Generate */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h3 className="font-semibold">PDF settings</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Page size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as Orientation)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fit mode</label>
              <select
                value={fitMode}
                onChange={(e) => setFitMode(e.target.value as FitMode)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {FIT_MODES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Margin</label>
                <Badge variant="secondary">{margin}mm</Badge>
              </div>
              <input
                type="range"
                min={0} max={30} step={5}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <Button
            onClick={generate}
            disabled={!images.length || busy}
            className="w-full gap-2"
            size="lg"
          >
            {busy ? (
              <><span className="animate-spin">⟳</span> Generating PDF…</>
            ) : (
              <><FileDown className="h-4 w-4" /> Generate & Download PDF ({images.length} page{images.length !== 1 ? 's' : ''})</>
            )}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Images are converted entirely in your browser and never uploaded to any server.
      </p>
    </div>
  );
}
