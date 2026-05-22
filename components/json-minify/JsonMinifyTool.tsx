'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle, CheckCircle2, Copy, Download, Eraser,
  FileJson, Minimize2, Sparkles, Upload,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { byteLength, formatBytes, formatJson, minifyJson } from '@/lib/json/format';
import { copyToClipboard, downloadBlob } from '@/lib/utils';
import { JsonEditor } from '@/components/json-formatter/JsonEditor';

type Status =
  | { kind: 'idle' }
  | { kind: 'success'; message: string; savedBytes?: number }
  | { kind: 'error'; message: string; line?: number };

const SAMPLE = `{
  "name": "QuickUtils",
  "version": "1.0.0",
  "description": "Free browser-based developer tools",
  "tools": [
    "json-formatter",
    "json-validator",
    "json-minify",
    "base64-encoder"
  ],
  "features": {
    "clientSide": true,
    "noSignup": true,
    "free": true
  }
}`;

export function JsonMinifyTool() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bytes = useMemo(() => byteLength(content), [content]);
  const lines = useMemo(() => (content ? content.split(/\n/).length : 0), [content]);

  const handleMinify = useCallback(() => {
    const originalBytes = byteLength(content);
    const result = minifyJson(content);
    if (result.ok) {
      const newBytes = byteLength(result.value);
      setContent(result.value);
      setStatus({
        kind: 'success',
        message: `Minified — saved ${formatBytes(originalBytes - newBytes)} (${Math.round(((originalBytes - newBytes) / originalBytes) * 100)}% smaller)`,
        savedBytes: originalBytes - newBytes,
      });
    } else {
      setStatus({ kind: 'error', message: result.error, line: result.line });
    }
  }, [content]);

  const handleBeautify = useCallback(() => {
    const result = formatJson(content, 2);
    if (result.ok) {
      setContent(result.value);
      setStatus({ kind: 'success', message: 'Beautified' });
    } else {
      setStatus({ kind: 'error', message: result.error, line: result.line });
    }
  }, [content]);

  const handleCopy = useCallback(async () => {
    if (!content) return;
    const ok = await copyToClipboard(content);
    setStatus(ok
      ? { kind: 'success', message: 'Copied to clipboard' }
      : { kind: 'error', message: 'Could not copy.' });
  }, [content]);

  const handleDownload = useCallback(() => {
    if (!content) return;
    downloadBlob(content, 'minified.json');
    setStatus({ kind: 'success', message: 'Downloaded minified.json' });
  }, [content]);

  const handleClear = useCallback(() => {
    setContent('');
    setStatus({ kind: 'idle' });
  }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setContent(text);
      setStatus({ kind: 'idle' });
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
        <Button onClick={handleMinify} size="sm" className="gap-1.5" disabled={!content}>
          <Minimize2 className="h-3.5 w-3.5" /> Minify
        </Button>
        <Button onClick={handleBeautify} size="sm" variant="secondary" className="gap-1.5" disabled={!content}>
          <Sparkles className="h-3.5 w-3.5" /> Beautify
        </Button>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <Button onClick={() => { setContent(SAMPLE); setStatus({ kind: 'idle' }); }}
          size="sm" variant="ghost" className="gap-1.5">
          <FileJson className="h-3.5 w-3.5" /> Sample
        </Button>
        <Button onClick={() => fileInputRef.current?.click()}
          size="sm" variant="ghost" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" /> Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json,.txt"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />

        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleCopy} size="sm" variant="ghost" disabled={!content} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button onClick={handleDownload} size="sm" variant="ghost" disabled={!content} className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button onClick={handleClear} size="sm" variant="ghost" disabled={!content} className="gap-1.5">
            <Eraser className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence mode="wait">
        {status.kind !== 'idle' && (
          <motion.div
            key={status.kind + ('message' in status ? status.message : '')}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
            className={
              'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ' +
              (status.kind === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                : 'border-destructive/30 bg-destructive/5 text-destructive')
            }
            role="status" aria-live="polite"
          >
            {status.kind === 'success'
              ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{status.message}{status.kind === 'error' && status.line &&
              <span className="ml-2 opacity-80">(line {status.line})</span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>JSON</span>
          {bytes > 0 && <span className="opacity-70">{formatBytes(bytes)}</span>}
          {lines > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {lines} {lines === 1 ? 'line' : 'lines'}
            </Badge>
          )}
        </div>
        <span className="opacity-70">Paste, upload, or drop a .json file</span>
      </div>

      {/* Editor */}
      <div className="h-[520px] md:h-[580px]">
        <JsonEditor
          value={content}
          onChange={(v) => { setContent(v); setStatus({ kind: 'idle' }); }}
          ariaLabel="JSON editor for minification"
          errorLine={status.kind === 'error' ? status.line : undefined}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Runs entirely in your browser. Your JSON is never uploaded to any server.
      </p>
    </div>
  );
}
