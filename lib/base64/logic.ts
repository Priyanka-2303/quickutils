export type Base64Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function encodeBase64(input: string): Base64Result {
  if (input.length === 0) return { ok: false, error: 'Input is empty.' };
  try {
    return { ok: true, value: btoa(unescape(encodeURIComponent(input))) };
  } catch {
    return { ok: false, error: 'Could not encode. Input may contain invalid characters.' };
  }
}

export function decodeBase64(input: string): Base64Result {
  const trimmed = input.trim();
  if (trimmed.length === 0) return { ok: false, error: 'Input is empty.' };
  try {
    return { ok: true, value: decodeURIComponent(escape(atob(trimmed))) };
  } catch {
    return { ok: false, error: 'Invalid Base64 string. Make sure there is no extra whitespace or incorrect padding.' };
  }
}

export function encodeBase64Url(input: string): Base64Result {
  const result = encodeBase64(input);
  if (!result.ok) return result;
  return { ok: true, value: result.value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') };
}

export function decodeBase64Url(input: string): Base64Result {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const padded2 = pad ? padded + '='.repeat(4 - pad) : padded;
  return decodeBase64(padded2);
}

export function isLikelyBase64(input: string): boolean {
  return /^[A-Za-z0-9+/=\-_]+$/.test(input.trim()) && input.trim().length > 0;
}
