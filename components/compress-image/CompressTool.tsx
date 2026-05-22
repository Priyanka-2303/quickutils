'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, ArrowRight, ImageIcon, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  compressImage,
  formatBytes,
  isAcceptedImage,
  type CompressResult,
} from '@/lib/compress/logic';
import { cn } from '@/lib/utils';

export function CompressTool() {
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult]   = useState<CompressResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxDim, setMaxDim]   = useState(1920);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!isAcceptedImage(f)) {
      setError('Unsupported format. Please use JPEG, PNG, WebP, GIF, or BMP.');
      return;
    }
    setError(null);
    setResult(null);
    setProgress(0);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const res = await compressImage(file, {
        maxSizeMB: 10,
        maxWidthOrHeight: maxDim,
        quality: quality / 100,
        onProgress: setProgress,
      });
      setResult(res);
    } catch {
      setError('Compression failed. Try a different image or lower the quality.');
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.objectUrl;
    const ext = result.file.name.split('.').pop() ?? 'jpg';
    a.download = `compressed.${ext}`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
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
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30',
          file && 'border-solid border-primary/40 bg-primary/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
        {file ? (
          <>
            <ImageIcon className="h-8 w-8 text-primary" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Drop an image here or click to browse</p>
              <p className="text-sm text-muted-foreground">JPEG, PNG, WebP, GIF, BMP</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Settings */}
      {file && !result && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Card>
              <CardContent className="space-y-4 p-4">
                <h3 className="font-semibold">Compression settings</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Quality</label>
                    <Badge variant="secondary">{quality}%</Badge>
                  </div>
                  <input
                    type="range"
                    min={10} max={100} step={5}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Max dimension (px)</label>
                  <select
                    value={maxDim}
                    onChange={(e) => setMaxDim(Number(e.target.value))}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[640, 1024, 1280, 1920, 2560, 3840].map((v) => (
                      <option key={v} value={v}>
                        {v}px{v === 1920 ? ' (default)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={compress} disabled={busy} className="w-full gap-2">
                  {busy ? (
                    <>
                      <span className="animate-spin">⟳</span> Compressing… {progress > 0 ? `${progress}%` : ''}
                    </>
                  ) : (
                    'Compress Image'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            {preview && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-48 w-full object-contain bg-muted/30"
                  />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Result */}
      {result && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-6">
                  {/* Before */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Original</p>
                    <p className="text-2xl font-bold tabular-nums">{formatBytes(result.originalSize)}</p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

                  {/* After */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Compressed</p>
                    <p className="text-2xl font-bold tabular-nums text-primary">{formatBytes(result.compressedSize)}</p>
                  </div>

                  {/* Savings badge */}
                  <Badge
                    variant={result.savingsPct > 0 ? 'success' : 'secondary'}
                    className="text-sm px-3 py-1"
                  >
                    {result.savingsPct > 0
                      ? `−${result.savingsPct}% smaller`
                      : 'No reduction (already optimal)'}
                  </Badge>

                  <div className="ml-auto flex gap-2">
                    <Button onClick={download} className="gap-2">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5" /> New image
                    </Button>
                  </div>
                </div>

                {/* After preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.objectUrl}
                  alt="Compressed preview"
                  className="mt-4 max-h-64 w-full rounded-lg object-contain bg-muted/30"
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      <p className="text-center text-xs text-muted-foreground">
        All compression happens in your browser — images are never uploaded to any server.
      </p>
    </div>
  );
}
