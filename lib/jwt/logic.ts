export type JWTParts = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: { header: string; payload: string; signature: string };
};

export type JWTResult =
  | { ok: true; parts: JWTParts; isExpired: boolean; expiresAt: Date | null }
  | { ok: false; error: string };

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const paddedStr = pad ? padded + '='.repeat(4 - pad) : padded;
  try {
    return decodeURIComponent(
      Array.from(atob(paddedStr))
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
  } catch {
    return atob(paddedStr);
  }
}

export function decodeJWT(token: string): JWTResult {
  const trimmed = token.trim();
  if (!trimmed) return { ok: false, error: 'Token is empty.' };

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return {
      ok: false,
      error: `A JWT must have exactly 3 parts separated by dots (found ${parts.length}).`,
    };
  }

  const [rawHeader, rawPayload, signature] = parts;

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    header = JSON.parse(base64UrlDecode(rawHeader));
  } catch {
    return { ok: false, error: 'Could not decode the header. It may not be valid Base64url JSON.' };
  }

  try {
    payload = JSON.parse(base64UrlDecode(rawPayload));
  } catch {
    return { ok: false, error: 'Could not decode the payload. It may not be valid Base64url JSON.' };
  }

  const exp = typeof payload.exp === 'number' ? payload.exp : null;
  const expiresAt = exp ? new Date(exp * 1000) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;

  return {
    ok: true,
    parts: {
      header,
      payload,
      signature,
      raw: { header: rawHeader, payload: rawPayload, signature },
    },
    isExpired,
    expiresAt,
  };
}

/** Standard JWT claim descriptions for tooltip display. */
export const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: 'Issuer — who issued the token',
  sub: 'Subject — who the token refers to',
  aud: 'Audience — who the token is intended for',
  exp: 'Expiration time (Unix timestamp)',
  nbf: 'Not before — token not valid before this time',
  iat: 'Issued at — when the token was issued',
  jti: 'JWT ID — unique identifier for this token',
  alg: 'Algorithm used to sign the token',
  typ: 'Token type (usually "JWT")',
  kid: 'Key ID — which key was used to sign',
};
