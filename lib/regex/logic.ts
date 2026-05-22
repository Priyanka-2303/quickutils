export type RegexFlags = {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
  dotAll: boolean;
};

export type RegexMatch = {
  value: string;
  index: number;
  groups: Record<string, string> | null;
};

export type RegexResult =
  | { ok: true; matches: RegexMatch[]; replacedText: string | null }
  | { ok: false; error: string };

export function buildFlags(flags: RegexFlags): string {
  let f = '';
  if (flags.global)          f += 'g';
  if (flags.caseInsensitive) f += 'i';
  if (flags.multiline)       f += 'm';
  if (flags.dotAll)          f += 's';
  return f;
}

export function testRegex(
  pattern: string,
  text: string,
  flags: RegexFlags,
  replacement?: string,
): RegexResult {
  if (!pattern) return { ok: true, matches: [], replacedText: null };

  let re: RegExp;
  try {
    re = new RegExp(pattern, buildFlags(flags));
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Invalid regex pattern.' };
  }

  try {
    const matches: RegexMatch[] = [];
    if (flags.global) {
      let m: RegExpExecArray | null;
      let lastIndex = -1;
      while ((m = re.exec(text)) !== null) {
        if (m.index === lastIndex) { re.lastIndex++; continue; }
        lastIndex = m.index;
        matches.push({ value: m[0], index: m.index, groups: m.groups ?? null });
      }
    } else {
      const m = re.exec(text);
      if (m) matches.push({ value: m[0], index: m.index, groups: m.groups ?? null });
    }

    const replacedText =
      replacement !== undefined && replacement !== ''
        ? text.replace(new RegExp(pattern, buildFlags(flags)), replacement)
        : null;

    return { ok: true, matches, replacedText };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Runtime error.' };
  }
}

export const REGEX_EXAMPLES = [
  { label: 'Email',       pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'URL',         pattern: 'https?://[^\\s]+', flags: 'g' },
  { label: 'IPv4',        pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { label: 'Date',        pattern: '\\d{4}-\\d{2}-\\d{2}', flags: 'g' },
  { label: 'Hex color',   pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'g' },
  { label: 'Phone (IN)', pattern: '[6-9]\\d{9}', flags: 'g' },
] as const;
