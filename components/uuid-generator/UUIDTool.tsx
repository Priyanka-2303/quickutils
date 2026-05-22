'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateBulk, formatUUID, isValidUUID, type UUIDFormat } from '@/lib/uuid/logic';
import { copyToClipboard } from '@/lib/utils';

const FORMAT_OPTIONS: { value: UUIDFormat; label: string; example: string }[] = [
  { value: 'standard',   label: 'Standard',    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  { value: 'uppercase',  label: 'Uppercase',   example: '3FA85F64-5717-4562-B3FC-2C963F66AFA6' },
  { value: 'no-hyphens', label: 'No hyphens',  example: '3fa85f6457174562b3fc2c963f66afa6' },
  { value: 'braces',     label: 'Braces',      example: '{3fa85f64-5717-4562-b3fc-2c963f66afa6}' },
];

export function UUIDTool() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<UUIDFormat>('standard');
  const [uuids, setUUIDs] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [validateInput, setValidateInput] = useState('');

  const generate = useCallback(() => {
    setUUIDs(generateBulk(count).map((u) => formatUUID(u, format)));
  }, [count, format]);

  const copyOne = useCallback(async (uuid: string) => {
    await copyToClipboard(uuid);
    setCopied(uuid);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const copyAll = useCallback(async () => {
    if (!uuids.length) return;
    await copyToClipboard(uuids.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  }, [uuids]);

  const validationResult = validateInput.trim()
    ? isValidUUID(validateInput)
    : null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Count</label>
          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value))))}
            className="h-8 w-20 rounded-md border bg-background px-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as UUIDFormat)}
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            {FORMAT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button onClick={generate} size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Generate
          </Button>
          <Button onClick={copyAll} size="sm" variant="secondary" disabled={!uuids.length} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            {copied === 'all' ? 'Copied!' : 'Copy all'}
          </Button>
          <Button onClick={() => setUUIDs([])} size="sm" variant="ghost" disabled={!uuids.length} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Format preview */}
      <div className="hidden rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground sm:block">
        Preview: <code className="ml-1 font-mono">{FORMAT_OPTIONS.find(o => o.value === format)?.example}</code>
      </div>

      {/* UUID list */}
      {uuids.length > 0 ? (
        <div className="max-h-[420px] space-y-1.5 overflow-y-auto rounded-xl border bg-card p-3">
          <AnimatePresence initial={false}>
            {uuids.map((uuid, i) => (
              <motion.div
                key={uuid + i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: 0.18 }}
                className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-muted/50"
              >
                <span className="flex-1 select-all font-mono text-sm">{uuid}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => copyOne(uuid)}
                  aria-label="Copy UUID"
                >
                  {copied === uuid
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid h-32 place-items-center rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground">
          Set a count and click <span className="mx-1 font-medium text-foreground">Generate</span>
        </div>
      )}

      {/* Inline validator */}
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-sm font-medium">Validate a UUID</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={validateInput}
            onChange={(e) => setValidateInput(e.target.value)}
            placeholder="Paste a UUID to check…"
            className="h-9 flex-1 rounded-md border bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          {validationResult !== null && (
            <Badge variant={validationResult ? 'success' : 'warning'} className="self-center">
              {validationResult ? 'Valid v4' : 'Invalid'}
            </Badge>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        UUIDs are generated using <code>crypto.randomUUID()</code> — cryptographically secure, entirely in your browser.
      </p>
    </div>
  );
}
