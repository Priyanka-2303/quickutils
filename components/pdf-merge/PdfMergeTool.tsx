'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, ChevronUp, ChevronDown, FileDown, FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  mkPdfEntry,
  readPageCount,
  mergePdfs,
  formatBytes,
  type PdfEntry,
} from '@/lib/pdf-merge/logic';
import { cn } from '@/lib/utils';

export function PdfMergeTool() {
  const [pdfs, setPdfs]   = useState<PdfEntry[]>([]);
  const [busy, setBusy]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    if (!accepted.length) return;

    const entries = accepted.map(mkPdfEntry);
    setPdfs((prev) => [...prev, ...entries]);

    // Async load page counts
    for (const entry of entries) {
      readPageCount(entry.file)
        .then((count) =>
          setPdfs((prev) =>
            prev.map((p) => (p.id === entry.id ? { ...p, pageCount: count } : p)),
          ),
        )
        .catch(() =>
          setPdfs((prev) =>
            prev.map((p) => (p.id === entry.id ? { ...p, pageCount: -1 } : p)),
          ),
        );
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const remove = (id: number) => setPdfs((p) => p.filter((x) => x.id !== id));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setPdfs((p) => {
      const arr = [...p];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const moveDown = (idx: number) => {
    setPdfs((p) => {
      if (idx >= p.length - 1) return p;
      const arr = [...p];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
  };

  const totalPages = pdfs.reduce((sum, p) => sum + (p.pageCount ?? 0), 0);

  const merge = async () => {
    if (pdfs.length < 2) return;
    setBusy(true);
    setProgress(0);
    setError(null);
    try {
      const bytes = await mergePdfs(pdfs, setProgress);
      const blob  = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href      = url;
      a.download  = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Merge failed. One or more PDFs may be encrypted or corrupted.');
    } finally {
      setBusy(false);
      setProgress(0);
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
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
        />
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Drop PDFs here or click to browse</p>
          <p className="text-sm text-muted-foreground">Select 2 or more PDF files to merge</p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* PDF list */}
      {pdfs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{pdfs.length} file{pdfs.length !== 1 ? 's' : ''}</h3>
              {totalPages > 0 && (
                <Badge variant="secondary">{totalPages} total pages</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPdfs([])} className="gap-1.5 text-destructive">
              <RotateCcw className="h-3.5 w-3.5" /> Clear all
            </Button>
          </div>

          <AnimatePresence initial={false}>
            {pdfs.map((pdf, i) => (
              <motion.div
                key={pdf.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
              >
                <span className="w-5 text-center text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                <FileText className="h-8 w-8 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{pdf.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(pdf.sizeBytes)}
                    {pdf.pageCount === null && ' · reading…'}
                    {pdf.pageCount !== null && pdf.pageCount > 0 && ` · ${pdf.pageCount} page${pdf.pageCount !== 1 ? 's' : ''}`}
                    {pdf.pageCount === -1 && ' · unreadable'}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveUp(i)} disabled={i === 0} aria-label="Move up">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveDown(i)} disabled={i === pdfs.length - 1} aria-label="Move down">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(pdf.id)} aria-label="Remove">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Merge button */}
      <Card>
        <CardContent className="p-4">
          {busy && progress > 0 && (
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Merging…</span>
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
          <Button
            onClick={merge}
            disabled={pdfs.length < 2 || busy}
            className="w-full gap-2"
            size="lg"
          >
            {busy ? (
              <><span className="animate-spin">⟳</span> Merging…</>
            ) : (
              <><FileDown className="h-4 w-4" /> Merge {pdfs.length >= 2 ? `${pdfs.length} PDFs` : 'PDFs'} & Download</>
            )}
          </Button>
          {pdfs.length < 2 && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Add at least 2 PDF files to enable merging.
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        All processing is done in your browser — PDFs are never sent to any server.
      </p>
    </div>
  );
}
