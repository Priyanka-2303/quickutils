'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Package, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  renderThumbnails,
  renderPages,
  downloadAsZip,
  downloadPage,
  SCALE_OPTIONS,
  type ExportFormat,
  type ExportScale,
  type PagePreview,
} from '@/lib/pdf-to-image/logic';
import { cn } from '@/lib/utils';

export function PdfToImageTool() {
  const [file, setFile]         = useState<File | null>(null);
  const [previews, setPreviews] = useState<PagePreview[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [scale, setScale]       = useState<ExportScale>(2);
  const [format, setFormat]     = useState<ExportFormat>('png');
  const [loading, setLoading]   = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    setError(null);
    setFile(f);
    setPreviews([]);
    setSelected(new Set());
    setLoading(true);
    try {
      const thumbs = await renderThumbnails(f);
      setPreviews(thumbs);
      setSelected(new Set(thumbs.map((t) => t.pageNumber)));
    } catch (err) {
      console.error(err);
      setError('Could not read PDF. The file may be corrupted or password-protected.');
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const togglePage = (n: number) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(n) ? s.delete(n) : s.add(n);
      return s;
    });
  };

  const selectAll = () => setSelected(new Set(previews.map((p) => p.pageNumber)));
  const selectNone = () => setSelected(new Set());

  const exportPages = async (asZip: boolean) => {
    if (!file || selected.size === 0) return;
    setExporting(true);
    setProgress(0);
    setError(null);
    try {
      const pages = await renderPages(
        file,
        Array.from(selected).sort((a, b) => a - b),
        scale,
        format,
        setProgress,
      );

      if (asZip) {
        const baseName = file.name.replace(/\.pdf$/i, '');
        await downloadAsZip(pages, baseName, format);
      } else {
        const baseName = file.name.replace(/\.pdf$/i, '');
        for (const { pageNumber, dataUrl } of pages) {
          downloadPage(dataUrl, pageNumber, baseName, format);
          // Small delay to avoid browser download manager spam
          await new Promise((r) => setTimeout(r, 120));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Export failed. Please try again.');
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviews([]);
    setSelected(new Set());
    setError(null);
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
            dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium">Drop a PDF here or click to browse</p>
            <p className="text-sm text-muted-foreground">Each page will be exported as an image</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
          <span className="animate-spin text-2xl">⟳</span>
          <span>Reading PDF pages…</span>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* File info + reset */}
      {file && previews.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{file.name}</span>
            <Badge variant="secondary">{previews.length} page{previews.length !== 1 ? 's' : ''}</Badge>
            <Badge variant="secondary">{selected.size} selected</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> New file
          </Button>
        </div>
      )}

      {/* Page thumbnails */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll} className="gap-1.5 text-xs">
              <CheckSquare className="h-3.5 w-3.5" /> All
            </Button>
            <Button variant="ghost" size="sm" onClick={selectNone} className="gap-1.5 text-xs">
              <Square className="h-3.5 w-3.5" /> None
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {previews.map((p) => {
              const isSelected = selected.has(p.pageNumber);
              return (
                <button
                  key={p.pageNumber}
                  onClick={() => togglePage(p.pageNumber)}
                  aria-pressed={isSelected}
                  className={cn(
                    'group relative flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent hover:border-muted-foreground/30',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.dataUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="w-full rounded object-contain bg-white shadow-sm"
                    style={{ aspectRatio: `${p.width}/${p.height}` }}
                  />
                  <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                    {p.pageNumber}
                  </span>
                  {isSelected && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Export settings */}
      {previews.length > 0 && (
        <Card>
          <CardContent className="space-y-4 p-4">
            <h3 className="font-semibold">Export settings</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Quality / scale</label>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value) as ExportScale)}
                  className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {SCALE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Format</label>
                <div className="flex gap-2">
                  {(['png', 'jpeg'] as ExportFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                        format === f
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'hover:border-primary/50',
                      )}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress */}
            {exporting && progress > 0 && (
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Rendering…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => exportPages(true)}
                disabled={selected.size === 0 || exporting}
                className="flex-1 gap-2"
              >
                {exporting ? (
                  <><span className="animate-spin">⟳</span> Exporting…</>
                ) : (
                  <><Package className="h-4 w-4" /> Download ZIP ({selected.size} page{selected.size !== 1 ? 's' : ''})</>
                )}
              </Button>
              {selected.size === 1 && (
                <Button
                  onClick={() => exportPages(false)}
                  disabled={exporting}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        PDF rendering happens entirely in your browser — files are never uploaded to any server.
      </p>
    </div>
  );
}
