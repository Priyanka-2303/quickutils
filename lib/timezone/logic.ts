/**
 * Timezone utilities — uses only the browser's built-in Intl API.
 * No external libraries needed.
 */

export type TZEntry = {
  tz: string;       // IANA timezone id, e.g. "Asia/Kolkata"
  label: string;    // Short display name, e.g. "Mumbai / Kolkata"
  abbr: string;     // Abbreviation, e.g. "IST"
  offset: string;   // UTC offset string, e.g. "UTC+5:30"
  offsetMinutes: number;
};

/** Curated list of the world's most-used timezones with friendly labels. */
export const POPULAR_TIMEZONES: { tz: string; label: string }[] = [
  { tz: 'Asia/Kolkata',          label: 'India (IST)' },
  { tz: 'America/New_York',      label: 'New York (ET)' },
  { tz: 'America/Chicago',       label: 'Chicago (CT)' },
  { tz: 'America/Denver',        label: 'Denver (MT)' },
  { tz: 'America/Los_Angeles',   label: 'Los Angeles (PT)' },
  { tz: 'America/Sao_Paulo',     label: 'São Paulo (BRT)' },
  { tz: 'Europe/London',         label: 'London (GMT/BST)' },
  { tz: 'Europe/Paris',          label: 'Paris / Berlin (CET)' },
  { tz: 'Europe/Moscow',         label: 'Moscow (MSK)' },
  { tz: 'Africa/Cairo',          label: 'Cairo (EET)' },
  { tz: 'Africa/Lagos',          label: 'Lagos (WAT)' },
  { tz: 'Asia/Dubai',            label: 'Dubai (GST)' },
  { tz: 'Asia/Karachi',          label: 'Karachi (PKT)' },
  { tz: 'Asia/Dhaka',            label: 'Dhaka (BST)' },
  { tz: 'Asia/Bangkok',          label: 'Bangkok (ICT)' },
  { tz: 'Asia/Singapore',        label: 'Singapore (SGT)' },
  { tz: 'Asia/Shanghai',         label: 'Shanghai / Beijing (CST)' },
  { tz: 'Asia/Tokyo',            label: 'Tokyo (JST)' },
  { tz: 'Asia/Seoul',            label: 'Seoul (KST)' },
  { tz: 'Australia/Sydney',      label: 'Sydney (AEST/AEDT)' },
  { tz: 'Pacific/Auckland',      label: 'Auckland (NZST)' },
  { tz: 'UTC',                   label: 'UTC' },
];

export function getOffsetMinutes(tz: string, at: Date = new Date()): number {
  // Trick: format a date in the target tz and in UTC, then diff.
  const fmt = (timeZone: string) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false,
    }).format(at);

  const local = new Date(fmt(tz));
  const utc   = new Date(fmt('UTC'));
  return Math.round((local.getTime() - utc.getTime()) / 60000);
}

export function offsetToString(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs  = Math.abs(offsetMinutes);
  const h    = Math.floor(abs / 60).toString().padStart(2, '0');
  const m    = (abs % 60).toString().padStart(2, '0');
  return `UTC${sign}${h}:${m}`;
}

export function getAbbr(tz: string, at: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, timeZoneName: 'short',
  }).formatToParts(at);
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? tz;
}

export function convertTime(date: Date, fromTZ: string, toTZ: string): Date {
  // Parse a date as if it were in fromTZ, then express it in toTZ.
  // Since JS dates are always UTC internally, we just reinterpret display.
  const fromOffset = getOffsetMinutes(fromTZ, date);
  const toOffset   = getOffsetMinutes(toTZ, date);
  const diff       = toOffset - fromOffset;
  return new Date(date.getTime() + diff * 60000);
}

export function formatInTZ(
  date: Date,
  tz: string,
  opts: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true,
    ...opts,
  }).format(date);
}

export function formatDateInTZ(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  }).format(date);
}

/** Build the full list of IANA timezones available in this browser. */
export function getAllTimezones(): string[] {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return POPULAR_TIMEZONES.map((t) => t.tz);
  }
}

export function buildTZEntry(tz: string, at: Date = new Date()): TZEntry {
  const offsetMinutes = getOffsetMinutes(tz, at);
  const popular = POPULAR_TIMEZONES.find((p) => p.tz === tz);
  return {
    tz,
    label: popular?.label ?? tz.replace(/_/g, ' '),
    abbr: getAbbr(tz, at),
    offset: offsetToString(offsetMinutes),
    offsetMinutes,
  };
}

export function getUserTZ(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
  catch { return 'UTC'; }
}
