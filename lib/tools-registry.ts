/**
 * Central registry of all utilities on the platform.
 * Adding a new tool here automatically wires it into:
 *   - homepage tool grid
 *   - sitemap.xml
 *   - related-tools sections
 *   - footer all-tools list
 *
 * status: 'live' tools are fully implemented and indexed.
 *         'planned' tools render as "coming soon" cards (still good for SEO).
 */

import type { LucideIcon } from 'lucide-react';
import {
  Braces,
  CheckCircle2,
  Minimize2,
  Image as ImageIcon,
  FileImage,
  Calculator,
  KeyRound,
  Hash,
  Regex,
  Fingerprint,
  Database,
  Clock,
  CalendarRange,
  Timer,
  FileText,
  Percent,
  FileOutput,
  FilePlus2,
  BadgeDollarSign,
} from 'lucide-react';

export type ToolCategory = 'developer' | 'image' | 'pdf' | 'finance' | 'time';

export type Tool = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  /** One-liner shown in cards / meta description fallback. */
  tagline: string;
  category: ToolCategory;
  icon: LucideIcon;
  status: 'live' | 'planned';
  /** Slugs of related tools for cross-linking. */
  related?: string[];
};

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    shortName: 'JSON Formatter',
    description:
      'Format, validate, and beautify JSON instantly in your browser. Supports large files, syntax highlighting, error detection, and one-click minify or download.',
    tagline: 'Format, validate & minify JSON instantly.',
    category: 'developer',
    icon: Braces,
    status: 'live',
    related: ['json-validator', 'json-minify', 'base64-encoder', 'jwt-decoder'],
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    shortName: 'JSON Validator',
    description:
      'Validate JSON syntax with detailed error messages and line numbers. Catch invalid JSON before it hits production.',
    tagline: 'Validate JSON with precise error messages.',
    category: 'developer',
    icon: CheckCircle2,
    status: 'live',
    related: ['json-formatter', 'json-minify'],
  },
  {
    slug: 'json-minify',
    name: 'JSON Minifier',
    shortName: 'JSON Minify',
    description: 'Strip whitespace from JSON to reduce payload size for production APIs.',
    tagline: 'Minify JSON to shrink payload size.',
    category: 'developer',
    icon: Minimize2,
    status: 'live',
    related: ['json-formatter', 'json-validator'],
  },
  {
    slug: 'base64-encoder',
    name: 'Base64 Encoder / Decoder',
    shortName: 'Base64',
    description: 'Encode and decode Base64 strings instantly.',
    tagline: 'Base64 encode and decode in the browser.',
    category: 'developer',
    icon: Hash,
    status: 'live',
    related: ['jwt-decoder', 'json-formatter'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    shortName: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens locally — header, payload, and signature.',
    tagline: 'Decode JWTs without leaving your browser.',
    category: 'developer',
    icon: KeyRound,
    status: 'live',
    related: ['base64-encoder', 'json-formatter'],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    shortName: 'Regex',
    description: 'Test and debug regular expressions with live match highlighting.',
    tagline: 'Test regex patterns with live highlighting.',
    category: 'developer',
    icon: Regex,
    status: 'live',
    related: ['json-formatter', 'base64-encoder', 'uuid-generator'],
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    shortName: 'UUID',
    description: 'Generate v4 UUIDs in bulk.',
    tagline: 'Generate v4 UUIDs in bulk.',
    category: 'developer',
    icon: Fingerprint,
    status: 'live',
    related: ['regex-tester', 'base64-encoder'],
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    shortName: 'SQL',
    description: 'Format and beautify SQL queries.',
    tagline: 'Format and beautify SQL queries.',
    category: 'developer',
    icon: Database,
    status: 'planned',
  },
  {
    slug: 'compress-image',
    name: 'Compress Image',
    shortName: 'Compress Image',
    description:
      'Reduce JPEG, PNG, WebP, GIF and BMP file sizes in your browser. Adjust quality and max dimensions. No uploads — entirely client-side.',
    tagline: 'Shrink images without losing quality.',
    category: 'image',
    icon: ImageIcon,
    status: 'live',
    related: ['image-to-pdf', 'pdf-to-image'],
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    shortName: 'Image to PDF',
    description:
      'Convert one or more images (JPEG, PNG, WebP) into a single PDF. Choose page size, orientation, and fit mode. Runs entirely in the browser.',
    tagline: 'Multiple images → one PDF, in seconds.',
    category: 'pdf',
    icon: FileImage,
    status: 'live',
    related: ['pdf-merge', 'pdf-to-image', 'compress-image'],
  },
  {
    slug: 'pdf-merge',
    name: 'PDF Merge',
    shortName: 'PDF Merge',
    description:
      'Merge two or more PDF files into a single document. Drag to reorder. All processing runs in your browser — PDFs are never uploaded.',
    tagline: 'Combine PDFs locally — no uploads.',
    category: 'pdf',
    icon: FilePlus2,
    status: 'live',
    related: ['pdf-to-image', 'image-to-pdf'],
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    shortName: 'PDF to Image',
    description:
      'Convert each PDF page to a high-quality PNG or JPEG. Select specific pages, set export scale, download as ZIP. Powered by PDF.js in your browser.',
    tagline: 'PDF pages → PNG / JPEG, no uploads.',
    category: 'pdf',
    icon: FileOutput,
    status: 'live',
    related: ['pdf-merge', 'image-to-pdf', 'compress-image'],
  },
  {
    slug: 'salary-calculator',
    name: 'Salary Calculator',
    shortName: 'Salary',
    description: 'Calculate take-home salary from CTC with Old vs New tax regime comparison, HRA exemption, PF and full deductions breakdown. FY 2024-25.',
    tagline: 'CTC to in-hand salary — Old & New regime.',
    category: 'finance',
    icon: Calculator,
    status: 'live',
    related: ['gst-calculator', 'emi-calculator'],
  },
  {
    slug: 'gst-calculator',
    name: 'GST Calculator',
    shortName: 'GST Calculator',
    description: 'Calculate GST for any amount across all slabs (0%, 5%, 12%, 18%, 28%). CGST, SGST, IGST breakdown. Inclusive and exclusive modes.',
    tagline: 'CGST + SGST + IGST breakdown, all slabs.',
    category: 'finance',
    icon: Percent,
    status: 'live',
    related: ['salary-calculator', 'emi-calculator'],
  },
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    shortName: 'EMI Calculator',
    description: 'Calculate loan EMI for home, car, personal and education loans with full amortization schedule and total interest breakdown.',
    tagline: 'Loan EMI with full amortization schedule.',
    category: 'finance',
    icon: Calculator,
    status: 'live',
    related: ['salary-calculator', 'gst-calculator', 'currency-converter'],
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    shortName: 'Currency',
    description:
      'Convert between 32 currencies with live ECB exchange rates. USD to INR, EUR to GBP, AED to INR and more. Multi-currency board shows 12 currencies at once.',
    tagline: 'Live exchange rates — 32 currencies.',
    category: 'finance',
    icon: BadgeDollarSign,
    status: 'live',
    related: ['emi-calculator', 'gst-calculator', 'salary-calculator'],
  },
  {
    slug: 'timezone-converter',
    name: 'Timezone Converter',
    shortName: 'Timezones',
    description:
      'Convert time between any timezones instantly. Live clock, custom date/time conversion, DST-aware, supports all IANA timezones.',
    tagline: 'Live clock across every timezone, DST-aware.',
    category: 'time',
    icon: Clock,
    status: 'live',
    related: ['meeting-planner', 'countdown-timer'],
  },
  {
    slug: 'meeting-planner',
    name: 'Meeting Planner',
    shortName: 'Meeting Planner',
    description:
      'Find the best meeting time across multiple timezones. Business-hours overlap highlighted green, night hours dimmed. DST-aware.',
    tagline: 'Visual overlap finder for remote teams.',
    category: 'time',
    icon: CalendarRange,
    status: 'live',
    related: ['timezone-converter', 'countdown-timer'],
  },
  {
    slug: 'countdown-timer',
    name: 'Countdown Timer',
    shortName: 'Countdown',
    description:
      'Create a shareable animated countdown to any date. Custom title, quick presets, and a shareable URL with the date encoded.',
    tagline: 'Animated countdown with shareable link.',
    category: 'time',
    icon: Timer,
    status: 'live',
    related: ['timezone-converter', 'meeting-planner'],
  },
];

export const liveTools = tools.filter((t) => t.status === 'live');

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(slug: string, limit = 5): Tool[] {
  const tool = getTool(slug);
  if (!tool) return [];
  const relatedSlugs = tool.related ?? [];
  const explicit = relatedSlugs
    .map((s) => getTool(s))
    .filter((t): t is Tool => Boolean(t));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  // Fill remainder with same-category tools.
  const filler = tools.filter(
    (t) => t.slug !== slug && t.category === tool.category && !relatedSlugs.includes(t.slug),
  );
  return [...explicit, ...filler].slice(0, limit);
}

export const toolCategories: Record<ToolCategory, string> = {
  developer: 'Developer Tools',
  image: 'Image Tools',
  pdf: 'PDF Tools',
  finance: 'Finance Tools',
  time: 'Time Tools',
};
