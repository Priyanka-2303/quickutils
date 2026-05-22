'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  Eraser,
  FileJson,
  Minimize2,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  byteLength,
  formatBytes,
  formatJson,
  minifyJson,
  validateJson,
} from '@/lib/json/format';
import { copyToClipboard, downloadBlob } from '@/lib/utils';
import { JsonEditor } from './JsonEditor';

type Status =
  | { kind: 'idle' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string; line?: number };

const SAMPLE_JSON = `{
  "name": "QuickUtils",
  "version": "1.0.0",
  "tools": ["json-formatter", "base64-encoder", "jwt-decoder"],
  "features": {
    "fast": true,
    "free": true,
    "browserBased": true
  }
}`;

const INDENT_OPTIONS = [
  { label: '2 spaces', value: '2' },
  { label: '4 spaces', value: '4' },
  { label: 'Tabs', value: 'tab' },
] as const;

function indentValue(token: string): number | string {
  if (token === 'tab') return '\t';
  return Number(token);
}

export function JsonFormatterTool() {
  const [content, setContent] = useState('');
  const [indent, setIndent] = useState<string>('2');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bytes = useMemo(() => byteLength(content), [content]);
  const lines = useMemo(() => (content ? content.split(/\n/).length : 0), [content]);

  const handleFormat = useCallback(() => {
    const result = formatJson(content, indentValue(indent));
    if (result.ok) {
      setContent(result.value);
      setStatus({ kind: 'success', message: 'Formatted successfully' });
    } else {
      setStatus({ kind: 'error', message: result.error, line: result.line });
    }
  }, [content, indent]);

  const handleMinify = useCallback(() => {
    const result = minifyJson(content);
    if (result.ok) {
      setContent(result.value);
      setStatus({ kind: 'success', message: 'Minified successfully' });
    } else {
      setStatus({ kind: 'error', message: result.error, line: result.line });
    }
  }, [content]);

  const handleValidate = useCallback(() => {
    const result = validateJson(content);
    if (result.ok) {
      setStatus({ kind: 'success', message: 'Valid JSON' });
    } else {
      setStatus({ kind: 'error', message: result.error, line: result.line });
    }
  }, [content]);

  const handleCopy = useCallback(async () => {
    if (!content) return;
    const ok = await copyToClipboard(content);
    setStatus(
      ok
        ? { kind: 'success', message: 'Copied to clipboard' }
        : { kind: 'error', message: 'Could not copy. Try selecting manually.' },
    );
  }, [content]);

  const handleDownload = useCallback(() => {
    if (!content) return;
    downloadBlob(content, 'formatted.json');
    setStatus({ kind: 'success', message: 'Downloaded formatted.json' });
  }, [content]);

  const handleClear = useCallback(() => {
    setContent('');
    setStatus({ kind: 'idle' });
  }, []);

  const handleSample = useCallback(() => {
    setContent(SAMPLE_JSON);
    setStatus({ kind: 'idle' });
  }, []);

  const handleFile = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setStatus({ kind: 'error', message: 'File too large (max 5 MB).' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setContent(text);
      setStatus({ kind: 'success', message: `Loaded ${file.name}` });
    };
    reader.onerror = () => setStatus({ kind: 'error', message: 'Could not read file.' });
    reader.readAsText(file);
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
        <Button onClick={handleFormat} size="sm" className="gap-1.5" disabled={!content}>
          <Sparkles className="h-3.5 w-3.5" />
          Format
        </Button>
        <Button
          onClick={handleValidate}
          size="sm"
          variant="secondary"
          className="gap-1.5"
          disabled={!content}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Validate
        </Button>
        <Button
          onClick={handleMinify}
          size="sm"
          variant="secondary"
          className="gap-1.5"
          disabled={!content}
        >
          <Minimize2 className="h-3.5 w-3.5" />
          Minify
        </Button>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Indent</span>
          <select
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
            className="h-8 rounded-md border bg-background px-2 text-xs"
            aria-label="Indent size"
          >
            {INDENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button onClick={handleSample} size="sm" variant="ghost" className="gap-1.5">
            <FileJson className="h-3.5 w-3.5" />
            Sample
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="sm"
            variant="ghost"
            className="gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json,.txt,text/plain"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = '';
            }}
          />
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            disabled={!content}
            className="gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Button
            onClick={handleDownload}
            size="sm"
            variant="ghost"
            disabled={!content}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button
            onClick={handleClear}
            size="sm"
            variant="ghost"
            disabled={!content}
            className="gap-1.5"
          >
            <Eraser className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Status bar */}
      <AnimatePresence mode="wait">
        {status.kind !== 'idle' && (
          <motion.div
            key={status.kind + ('message' in status ? status.message : '')}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={
              'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ' +
              (status.kind === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                : 'border-destructive/30 bg-destructive/5 text-destructive')
            }
            role="status"
            aria-live="polite"
          >
            {status.kind === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span className="break-words">
              {status.message}
              {status.kind === 'error' && status.line && (
                <span className="ml-2 opacity-80">(line {status.line})</span>
              )}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
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
        <span className="opacity-70">
          Paste JSON, click <span className="font-medium text-foreground">Sample</span>, or drop a
          <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-[10px]">.json</code>
          file
        </span>
      </div>
      <div
        className={
          'relative h-[520px] rounded-lg transition-shadow md:h-[600px] ' +
          (isDragging ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '')
        }
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        <JsonEditor
          value={content}
          onChange={setContent}
          ariaLabel="JSON editor"
          errorLine={status.kind === 'error' ? status.line : undefined}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Everything runs in your browser. Your JSON is never uploaded to our servers.
      </p>
    </div>
  );
}
