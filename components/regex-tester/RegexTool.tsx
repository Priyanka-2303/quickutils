'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { testRegex, REGEX_EXAMPLES, type RegexFlags } from '@/lib/regex/logic';

const SAMPLE_TEXT = `Contact us at support@quickutils.dev or sales@quickutils.dev.
Visit https://quickutils.dev for more info.
Server IP: 192.168.1.100 — backup: 10.0.0.1
Release date: 2024-12-01, next release 2025-06-15.`;

const FLAG_OPTIONS: { key: keyof RegexFlags; label: string; title: string }[] = [
  { key: 'global',          label: 'g', title: 'Global — find all matches' },
  { key: 'caseInsensitive', label: 'i', title: 'Case-insensitive' },
  { key: 'multiline',       label: 'm', title: 'Multiline — ^ and $ match line boundaries' },
  { key: 'dotAll',          label: 's', title: 'Dot-all — . matches newlines' },
];

/** Highlight matches inside a string, returning segments. */
function highlightSegments(text: string, pattern: string, flags: RegexFlags) {
  if (!pattern) return [{ text, match: false }];
  try {
    const flagStr = (flags.global ? 'g' : '') + (flags.caseInsensitive ? 'i' : '') +
      (flags.multiline ? 'm' : '') + (flags.dotAll ? 's' : '');
    const re = new RegExp(pattern, flagStr || 'g');
    const segments: { text: string; match: boolean }[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    let prev = -1;
    while ((m = re.exec(text)) !== null) {
      if (m.index === prev) { re.lastIndex++; continue; }
      prev = m.index;
      if (m.index > lastIndex) segments.push({ text: text.slice(lastIndex, m.index), match: false });
      segments.push({ text: m[0], match: true });
      lastIndex = m.index + m[0].length;
      if (!flags.global) break;
    }
    if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), match: false });
    return segments;
  } catch {
    return [{ text, match: false }];
  }
}

export function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState(SAMPLE_TEXT);
  const [replacement, setReplacement] = useState('');
  const [flags, setFlags] = useState<RegexFlags>({ global: true, caseInsensitive: false, multiline: false, dotAll: false });

  const toggleFlag = useCallback((key: keyof RegexFlags) => {
    setFlags((f) => ({ ...f, [key]: !f[key] }));
  }, []);

  const result = useMemo(
    () => testRegex(pattern, testText, flags, replacement || undefined),
    [pattern, testText, flags, replacement],
  );

  const segments = useMemo(
    () => highlightSegments(testText, pattern, flags),
    [testText, pattern, flags],
  );

  const matchCount = result.ok ? result.matches.length : 0;

  return (
    <div className="space-y-4">
      {/* Pattern input */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b bg-muted/30 px-3 py-2">
          <span className="font-mono text-muted-foreground">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern…"
            className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/50"
            spellCheck={false}
            aria-label="Regular expression pattern"
          />
          <span className="font-mono text-muted-foreground">/</span>

          {/* Flags */}
          <div className="flex items-center gap-1">
            {FLAG_OPTIONS.map(({ key, label, title }) => (
              <button
                key={key}
                onClick={() => toggleFlag(key)}
                title={title}
                className={
                  'h-6 w-6 rounded text-xs font-bold font-mono transition-colors ' +
                  (flags[key] ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground')
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {result && !result.ok && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: 'auto' }}
              exit={{ height: 0 }} transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {result.error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Match count bar */}
        <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3 flex-wrap">
            {REGEX_EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setPattern(ex.pattern)}
                className="rounded bg-muted/50 px-2 py-0.5 text-[10px] hover:bg-muted"
              >
                {ex.label}
              </button>
            ))}
          </div>
          {pattern && result.ok && (
            <Badge variant={matchCount > 0 ? 'success' : 'warning'} className="text-[10px] shrink-0">
              {matchCount} {matchCount === 1 ? 'match' : 'matches'}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Test string with highlights */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-muted-foreground">Test string</span>
            <Button onClick={() => setTestText(SAMPLE_TEXT)} size="sm" variant="ghost"
              className="h-6 gap-1 px-2 text-[10px]">Reset</Button>
          </div>
          <div className="relative">
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="h-52 w-full resize-none rounded-lg border bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
              style={{ color: 'transparent', caretColor: 'var(--foreground)' }}
              spellCheck={false}
              aria-label="Test string"
            />
            {/* Highlight overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 h-52 overflow-hidden rounded-lg p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
            >
              {segments.map((seg, i) =>
                seg.match ? (
                  <mark key={i} className="rounded-sm bg-yellow-300/70 text-foreground dark:bg-yellow-500/40">
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Matches + replace */}
        <div className="flex flex-col gap-3">
          {/* Matches list */}
          <div className="flex flex-col gap-1.5">
            <span className="px-1 text-xs font-medium text-muted-foreground">
              Matches {matchCount > 0 && <span className="text-emerald-500">({matchCount})</span>}
            </span>
            <div className="h-28 overflow-y-auto rounded-lg border bg-muted/20 p-2">
              {result.ok && result.matches.length > 0 ? (
                <div className="space-y-1">
                  {result.matches.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted/50">
                      <span className="w-5 shrink-0 text-center text-muted-foreground">{i + 1}</span>
                      <code className="flex-1 break-all font-mono">{JSON.stringify(m.value)}</code>
                      <span className="text-muted-foreground/60">@{m.index}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center text-xs text-muted-foreground">
                  {pattern ? (result.ok ? 'No matches' : 'Invalid pattern') : 'Enter a pattern above'}
                </div>
              )}
            </div>
          </div>

          {/* Replace */}
          <div className="flex flex-col gap-1.5">
            <span className="px-1 text-xs font-medium text-muted-foreground">Replace with</span>
            <input
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="Replacement string… ($1 for groups)"
              className="h-9 rounded-md border bg-background px-3 font-mono text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
            {result.ok && result.replacedText !== null && (
              <div className="rounded-lg border bg-muted/20 p-2">
                <p className="mb-1 text-[10px] text-muted-foreground">Result</p>
                <p className="break-words font-mono text-xs">{result.replacedText}</p>
              </div>
            )}
          </div>

          {/* Named groups */}
          {result.ok && result.matches.some((m) => m.groups) && (
            <div className="rounded-lg border bg-card p-2">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Named groups</p>
              {result.matches.filter((m) => m.groups).map((m, i) => (
                <div key={i} className="mb-1">
                  {Object.entries(m.groups!).map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-xs">
                      <code className="text-primary">{k}</code>
                      <span>{JSON.stringify(v)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Uses JavaScript&apos;s native RegExp engine. All processing happens in your browser.
      </p>
    </div>
  );
}
