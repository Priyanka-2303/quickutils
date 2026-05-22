/**
 * Pure JSON helpers used by the formatter UI.
 * Kept separate from React so they're trivially testable and tree-shakeable.
 */

export type JsonResult =
  | { ok: true; value: string }
  | { ok: false; error: string; line?: number; column?: number };

export type ParseError = {
  message: string;
  line?: number;
  column?: number;
  offset?: number;
};

/**
 * Parse JSON and produce a precise error location when it fails.
 * V8/JSC error messages include "position N" — we map that back to line/col.
 */
export function parseJson(input: string): { ok: true; value: unknown } | { ok: false; error: ParseError } {
  if (input.trim().length === 0) {
    return { ok: false, error: { message: 'Input is empty.' } };
  }
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';
    const offset = extractOffset(message);
    if (offset == null) return { ok: false, error: { message } };
    const { line, column } = offsetToLineCol(input, offset);
    return { ok: false, error: { message, line, column, offset } };
  }
}

function extractOffset(message: string): number | null {
  const m = message.match(/position\s+(\d+)/i);
  if (m) return Number(m[1]);
  // Some engines: "at line X column Y"
  return null;
}

function offsetToLineCol(src: string, offset: number) {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < offset && i < src.length; i++) {
    if (src.charCodeAt(i) === 10 /* \n */) {
      line++;
      lastNewline = i;
    }
  }
  return { line, column: offset - lastNewline };
}

export function formatJson(input: string, indent: number | string = 2): JsonResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return {
      ok: false,
      error: parsed.error.message,
      line: parsed.error.line,
      column: parsed.error.column,
    };
  }
  return { ok: true, value: JSON.stringify(parsed.value, null, indent) };
}

export function minifyJson(input: string): JsonResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return {
      ok: false,
      error: parsed.error.message,
      line: parsed.error.line,
      column: parsed.error.column,
    };
  }
  return { ok: true, value: JSON.stringify(parsed.value) };
}

export function validateJson(input: string): JsonResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return {
      ok: false,
      error: parsed.error.message,
      line: parsed.error.line,
      column: parsed.error.column,
    };
  }
  return { ok: true, value: 'Valid JSON' };
}

/** Approx byte length (UTF-8) without allocating a Blob. */
export function byteLength(s: string): number {
  let bytes = 0;
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code < 0x80) bytes += 1;
    else if (code < 0x800) bytes += 2;
    else if (code >= 0xd800 && code <= 0xdbff) {
      bytes += 4;
      i++;
    } else bytes += 3;
  }
  return bytes;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
