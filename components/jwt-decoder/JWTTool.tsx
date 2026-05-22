'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, Copy, Eraser, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { decodeJWT, CLAIM_DESCRIPTIONS } from '@/lib/jwt/logic';
import { copyToClipboard } from '@/lib/utils';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function JsonTree({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-1.5">
      {Object.entries(data).map(([key, val]) => {
        const desc = CLAIM_DESCRIPTIONS[key];
        const isTimestamp = (key === 'exp' || key === 'iat' || key === 'nbf') && typeof val === 'number';
        return (
          <div key={key} className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
            <span className="min-w-[80px] font-mono text-xs font-semibold text-primary">{key}</span>
            <div className="flex-1 min-w-0">
              <span className="break-all font-mono text-sm">
                {JSON.stringify(val)}
              </span>
              {isTimestamp && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({new Date((val as number) * 1000).toLocaleString()})
                </span>
              )}
              {desc && (
                <p className="mt-0.5 hidden text-xs text-muted-foreground group-hover:block">{desc}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function JWTTool() {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const result = token.trim() ? decodeJWT(token) : null;

  const handleChange = (v: string) => {
    setToken(v);
    setError(null);
  };

  const copySection = useCallback(async (label: string, content: string) => {
    await copyToClipboard(content);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const sections = result?.ok
    ? [
        { label: 'Header', data: result.parts.header, color: 'text-rose-500' },
        { label: 'Payload', data: result.parts.payload, color: 'text-violet-500' },
      ]
    : [];

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted-foreground">JWT Token</span>
          <div className="flex items-center gap-2">
            <Button onClick={() => { setToken(SAMPLE_JWT); setError(null); }}
              size="sm" variant="ghost" className="h-6 gap-1 px-2 text-[10px]">Sample</Button>
            <Button onClick={() => { setToken(''); setError(null); }}
              size="sm" variant="ghost" disabled={!token} className="h-6 gap-1 px-2 text-[10px]">
              <Eraser className="h-3 w-3" /> Clear
            </Button>
          </div>
        </div>
        <textarea
          value={token}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste your JWT here — eyJhbGci..."
          className="h-28 w-full resize-none rounded-lg border bg-card p-3 font-mono text-xs leading-relaxed outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring"
          spellCheck={false}
          aria-label="JWT token input"
        />
      </div>

      {/* Error */}
      <AnimatePresence mode="wait">
        {result && !result.ok && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {result.error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decoded sections */}
      <AnimatePresence>
        {result?.ok && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="space-y-3"
          >
            {/* Status bar */}
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-3 py-2 text-sm">
              <div className="flex items-center gap-1.5">
                {result.isExpired
                  ? <ShieldAlert className="h-4 w-4 text-destructive" />
                  : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                <span className={result.isExpired ? 'text-destructive' : 'text-emerald-700 dark:text-emerald-300'}>
                  {result.isExpired ? 'Token is EXPIRED' : 'Token has not expired'}
                </span>
              </div>
              {result.expiresAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Expires {result.expiresAt.toLocaleString()}
                </div>
              )}
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {(result.parts.header.alg as string) ?? 'Unknown alg'}
              </Badge>
            </div>

            {/* Header + Payload cards */}
            {sections.map(({ label, data, color }) => (
              <div key={label} className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
                  <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</span>
                  <Button
                    size="sm" variant="ghost"
                    className="h-6 gap-1 px-2 text-[10px]"
                    onClick={() => copySection(label, JSON.stringify(data, null, 2))}
                  >
                    {copied === label
                      ? <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Copied</>
                      : <><Copy className="h-3 w-3" /> Copy</>}
                  </Button>
                </div>
                <div className="p-3">
                  <JsonTree data={data} />
                </div>
              </div>
            ))}

            {/* Signature */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Signature</span>
                <Button size="sm" variant="ghost" className="h-6 gap-1 px-2 text-[10px]"
                  onClick={() => copySection('signature', result.parts.signature)}>
                  {copied === 'signature'
                    ? <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Copied</>
                    : <><Copy className="h-3 w-3" /> Copy</>}
                </Button>
              </div>
              <div className="p-3">
                <p className="break-all font-mono text-xs text-muted-foreground">
                  {result.parts.signature}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  The signature cannot be verified client-side without the secret key. This tool only decodes the token.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-muted-foreground">
        Decoding runs entirely in your browser. Your token is never sent to any server.
      </p>
    </div>
  );
}
