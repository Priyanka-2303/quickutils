'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Copy, Eraser, FileJson, Upload, XCircle } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { validateJson, parseJson, byteLength, formatBytes } from '@/lib/json/format';
import { copyToClipboard } from '@/lib/utils';
import { JsonEditor } from '@/components/json-formatter/JsonEditor';

type ValidationState =
  | { kind: 'idle' }
  | { kind: 'valid'; stats: { keys: number; depth: number; size: string } }
  | { kind: 'invalid'; message: string; line?: number };

function countKeys(obj: unknown, depth = 0): { keys: number; maxDepth: number } {
  if (typeof obj !== 'object' || obj === null) return { keys: 0, maxDepth: depth };
  let keys = 0;
  let maxDepth = depth;
  for (const val of Object.values(obj as Record<string, unknown>)) {
    keys++;
    const child = countKeys(val, depth + 1);
    keys += child.keys;
    maxDepth = Math.max(maxDepth, child.maxDepth);
  }
  return { keys, maxDepth };
}

const SAMPLE_INVALID = `{
  "name": "QuickUtils",
  "version": 1.0.0,
  "tags": ["tools", "developer",],
  "active": true
}`;

const SAMPLE_VALID = `{
  "name": "QuickUtils",
  "version": "1.0.0",
  "tags": ["tools", "developer"],
  "active": true
}`;

export function JsonValidatorTool() {
  const [content, setContent] = useState('');
  const [validation, setValidation] = useState<ValidationState>({ kind: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bytes = useMemo(() => byteLength(content), [content]);
  const lines = useMemo(() => (content ? content.split(/\n/).length : 0), [content]);

  const handleValidate = useCallback(() => {
    const result = validateJson(content);
    if (result.ok) {
      const parsed = parseJson(content);
      const { keys, maxDepth } = parsed.ok ? countKeys(parsed.value) : { keys: 0, maxDepth: 0 };
      setValidation({
        kind: 'valid',
        stats: { keys, depth: maxDepth, size: formatBytes(byteLength(content)) },
      });
    } else {
      setValidation({ kind: 'invalid', message: result.error, line: result.line });
    }
  }, [content]);

  const handleCopy = useCallback(async () => {
    if (!content) return;
    await copyToClipboard(content);
  }, [content]);

  const handleClear = useCallback(() => {
    setContent('');
    setValidation({ kind: 'idle' });
  }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setContent(text);
      setValidation({ kind: 'idle' });
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
        <Button onClick={handleValidate} size="sm" className="gap-1.5" disabled={!content}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Validate
        </Button>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <Button
          onClick={() => { setContent(SAMPLE_VALID); setValidation({ kind: 'idle' }); }}
          size="sm" variant="ghost" className="gap-1.5"
        >
          <FileJson className="h-3.5 w-3.5" /> Valid sample
        </Button>
        <Button
          onClick={() => { setContent(SAMPLE_INVALID); setValidation({ kind: 'idle' }); }}
          size="sm" variant="ghost" className="gap-1.5"
        >
          <XCircle className="h-3.5 w-3.5" /> Invalid sample
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          size="sm" variant="ghost" className="gap-1.5"
        >
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
          <Button onClick={handleClear} size="sm" variant="ghost" disabled={!content} className="gap-1.5">
            <Eraser className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Validation result banner */}
      <AnimatePresence mode="wait">
        {validation.kind !== 'idle' && (
          <motion.div
            key={validation.kind}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={
              'flex items-start gap-3 rounded-xl border p-4 ' +
              (validation.kind === 'valid'
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-destructive/30 bg-destructive/5')
            }
            role="status"
            aria-live="polite"
          >
            {validation.kind === 'valid' ? (
              <>
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">Valid JSON</p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                    <span>{validation.stats.size}</span>
                    <span>·</span>
                    <span>{validation.stats.keys} keys</span>
                    <span>·</span>
                    <span>{validation.stats.depth} levels deep</span>
                    <span>·</span>
                    <span>{lines} lines</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Invalid JSON</p>
                  <p className="mt-0.5 text-sm text-destructive/80">
                    {validation.message}
                    {validation.line && (
                      <span className="ml-2 opacity-70">(line {validation.line})</span>
                    )}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
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
        <span className="opacity-70">Paste JSON or upload a file</span>
      </div>

      {/* Editor */}
      <div className="h-[520px] md:h-[580px]">
        <JsonEditor
          value={content}
          onChange={(v) => { setContent(v); setValidation({ kind: 'idle' }); }}
          ariaLabel="JSON input for validation"
          errorLine={validation.kind === 'invalid' ? validation.line : undefined}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Validation runs entirely in your browser. Your JSON is never sent to any server.
      </p>
    </div>
  );
}
