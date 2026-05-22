'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeftRight, CheckCircle2, Copy, Eraser } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { encodeBase64, decodeBase64, encodeBase64Url, decodeBase64Url, isLikelyBase64 } from '@/lib/base64/logic';
import { copyToClipboard } from '@/lib/utils';

type Mode = 'encode' | 'decode';
type Variant = 'standard' | 'url-safe';
type Status = { kind: 'idle' } | { kind: 'success'; msg: string } | { kind: 'error'; msg: string };

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [variant, setVariant] = useState<Variant>('standard');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const process = useCallback((text: string, m: Mode, v: Variant) => {
    if (!text) { setOutput(''); setStatus({ kind: 'idle' }); return; }
    const fn = m === 'encode'
      ? (v === 'url-safe' ? encodeBase64Url : encodeBase64)
      : (v === 'url-safe' ? decodeBase64Url : decodeBase64);
    const result = fn(text);
    if (result.ok) {
      setOutput(result.value);
      setStatus({ kind: 'success', msg: m === 'encode' ? 'Encoded successfully' : 'Decoded successfully' });
    } else {
      setOutput('');
      setStatus({ kind: 'error', msg: result.error });
    }
  }, []);

  const handleInput = (v: string) => {
    setInput(v);
    process(v, mode, variant);
  };

  const toggleMode = () => {
    const next = mode === 'encode' ? 'decode' : 'encode';
    setMode(next);
    setInput(output);
    setOutput('');
    setStatus({ kind: 'idle' });
    setTimeout(() => process(output, next, variant), 0);
  };

  const handleVariantChange = (v: Variant) => {
    setVariant(v);
    process(input, mode, v);
  };

  const copyOutput = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    setStatus(ok ? { kind: 'success', msg: 'Copied to clipboard' } : { kind: 'error', msg: 'Copy failed' });
  };

  const autoDetect = () => {
    if (!input) return;
    const guessed: Mode = isLikelyBase64(input) ? 'decode' : 'encode';
    setMode(guessed);
    process(input, guessed, variant);
  };

  return (
    <div className="space-y-4">
      {/* Mode + Variant controls */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
        {/* Mode toggle */}
        <div className="flex rounded-lg border overflow-hidden text-sm">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); process(input, m, variant); }}
              className={
                'px-3 py-1.5 font-medium capitalize transition-colors ' +
                (mode === m ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')
              }
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

        {/* Variant toggle */}
        <div className="flex rounded-lg border overflow-hidden text-xs">
          {([['standard', 'Standard'], ['url-safe', 'URL-safe']] as [Variant, string][]).map(([v, label]) => (
            <button
              key={v}
              onClick={() => handleVariantChange(v)}
              className={
                'px-2.5 py-1.5 font-medium transition-colors ' +
                (variant === v ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted')
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button onClick={autoDetect} size="sm" variant="ghost" className="gap-1.5" disabled={!input}>
            <ArrowLeftRight className="h-3.5 w-3.5" /> Auto-detect
          </Button>
          <Button onClick={() => { setInput(''); setOutput(''); setStatus({ kind: 'idle' }); }}
            size="sm" variant="ghost" disabled={!input} className="gap-1.5">
            <Eraser className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence mode="wait">
        {status.kind !== 'idle' && (
          <motion.div
            key={status.kind + status.msg}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
            className={
              'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ' +
              (status.kind === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                : 'border-destructive/30 bg-destructive/5 text-destructive')
            }
            role="status" aria-live="polite"
          >
            {status.kind === 'success'
              ? <CheckCircle2 className="h-4 w-4 shrink-0" />
              : <AlertCircle className="h-4 w-4 shrink-0" />}
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-pane layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-muted-foreground">
              {mode === 'encode' ? 'Plain text' : 'Base64 string'}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {input.length} chars
            </Badge>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode…' : 'Enter Base64 string to decode…'}
            className="h-52 w-full resize-none rounded-lg border bg-card p-3 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring"
            spellCheck={false}
            aria-label={mode === 'encode' ? 'Text to encode' : 'Base64 to decode'}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-muted-foreground">
              {mode === 'encode' ? 'Base64 output' : 'Decoded text'}
            </span>
            <div className="flex items-center gap-2">
              {output && (
                <Badge variant="success" className="text-[10px]">
                  {output.length} chars
                </Badge>
              )}
              <Button onClick={copyOutput} size="sm" variant="ghost" disabled={!output} className="h-6 gap-1 px-2 text-[10px]">
                <Copy className="h-3 w-3" /> Copy
              </Button>
            </div>
          </div>
          <div className="relative h-52">
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here…"
              className="h-full w-full resize-none rounded-lg border bg-muted/30 p-3 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
              aria-label="Output"
            />
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Encoding and decoding run entirely in your browser using the Web API. No data is sent to any server.
      </p>
    </div>
  );
}
