/** Generate a v4 UUID using the browser's crypto API (RFC 4122). */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateBulk(count: number): string[] {
  return Array.from({ length: Math.min(count, 500) }, generateUUID);
}

export type UUIDFormat = 'standard' | 'uppercase' | 'no-hyphens' | 'braces';

export function formatUUID(uuid: string, fmt: UUIDFormat): string {
  switch (fmt) {
    case 'uppercase':   return uuid.toUpperCase();
    case 'no-hyphens':  return uuid.replace(/-/g, '');
    case 'braces':      return `{${uuid}}`;
    default:            return uuid;
  }
}

export function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
}
