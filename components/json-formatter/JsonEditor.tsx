'use client';

import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// Monaco is heavy (~1MB). Load only on the client and only when this component renders.
const Editor = dynamic(() => import('@monaco-editor/react').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-muted/40 text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
});

type JsonEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string | number;
  /** Line number to highlight as an error. Updates reactively. */
  errorLine?: number;
  ariaLabel?: string;
};

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  height = '100%',
  errorLine,
  ariaLabel,
}: JsonEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Keep error markers in sync with the latest errorLine prop. onMount only fires
  // once, so this effect runs on every change instead.
  useEffect(() => {
    const ed = editorRef.current;
    const mn = monacoRef.current;
    if (!ed || !mn) return;
    const model = ed.getModel();
    if (!model) return;
    if (errorLine && errorLine > 0) {
      mn.editor.setModelMarkers(model, 'json-formatter', [
        {
          startLineNumber: errorLine,
          endLineNumber: errorLine,
          startColumn: 1,
          endColumn: 1000,
          message: 'Parse error here',
          severity: mn.MarkerSeverity.Error,
        },
      ]);
      ed.revealLineInCenter(errorLine);
    } else {
      mn.editor.setModelMarkers(model, 'json-formatter', []);
    }
  }, [errorLine]);

  const theme = mounted && resolvedTheme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div
      className="h-full w-full overflow-hidden rounded-lg border bg-card"
      role="region"
      aria-label={ariaLabel}
    >
      <Editor
        height={height}
        defaultLanguage="json"
        language="json"
        value={value}
        onChange={(v) => onChange?.(v ?? '')}
        theme={theme}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontLigatures: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: false,
          renderLineHighlight: 'line',
          padding: { top: 12, bottom: 12 },
          fixedOverflowWidgets: true,
          automaticLayout: true,
        }}
        onMount={(ed, mn) => {
          editorRef.current = ed;
          monacoRef.current = mn;
        }}
      />
    </div>
  );
}
