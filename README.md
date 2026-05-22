# QuickUtils

A scalable platform for fast, free, browser-based developer micro-tools — built as a single Next.js codebase where every utility shares layout, SEO, ads, and analytics. Adding a new tool is one route + one registry entry.

The first live tool is the **JSON Formatter** at `/json-formatter`.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with shadcn-style primitives
- **Monaco Editor** (lazy-loaded, ~1 MB chunked off the main bundle)
- **Framer Motion** for micro-interactions
- **next-themes** for dark/light mode
- **Zero backend** — every tool runs entirely in the browser

---

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Local development server with HMR |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build locally |
| `pnpm typecheck` | TypeScript checks |
| `pnpm lint` | ESLint |
| `pnpm pages:build` | Build for Cloudflare Pages |
| `pnpm pages:deploy` | Deploy to Cloudflare Pages (requires wrangler login) |

---

## Project structure

```
app/
  layout.tsx            # Root layout: header, footer, theme, analytics, ads
  page.tsx              # Homepage with tool grid
  sitemap.ts            # Auto-generated from tools-registry
  robots.ts
  (tools)/
    json-formatter/page.tsx   # First live tool
  privacy/, terms/, contact/  # Legal/static pages
components/
  layout/               # Header, Footer, ThemeProvider, ThemeToggle
  ui/                   # Button, Card, Badge, Separator (shadcn-style)
  tool-page/            # Reusable Hero, FaqSection, RelatedTools, ContentSection, ToolPageLayout
  json-formatter/       # JSON editor + formatter UI
  ads/                  # AdSlot, BannerAd, SidebarAd, MobileStickyAd, AdSenseScript
  analytics/            # GA4 + Microsoft Clarity loader and track() helper
  seo/                  # JsonLd renderer
lib/
  site-config.ts        # Site-wide constants (name, URL, keywords)
  tools-registry.ts     # ★ Single source of truth for every tool on the platform
  seo/
    metadata.ts         # buildMetadata() — call this from every page
    jsonld.ts           # Schema.org helpers (Organization, FAQ, SoftwareApp, Breadcrumb)
  json/format.ts        # Pure JSON parse/format/minify/validate helpers
  utils.ts              # cn(), copyToClipboard(), downloadBlob()
public/                 # Static assets (favicon, og images, robots.txt fallback)
```

---

## Adding a new tool

The architecture is designed so new utilities take ~30 minutes end-to-end.

**1. Register the tool** in `lib/tools-registry.ts`:

```ts
{
  slug: 'base64-encoder',
  name: 'Base64 Encoder / Decoder',
  shortName: 'Base64',
  description: 'Encode and decode Base64 strings instantly.',
  tagline: 'Base64 encode and decode in the browser.',
  category: 'developer',
  icon: Hash,
  status: 'live',                    // ← flip from 'planned' when ready
  related: ['json-formatter', 'jwt-decoder'],
}
```

That alone gives you:

- a homepage card,
- header/footer navigation,
- a sitemap entry,
- cross-linking from related tools.

**2. Build the tool component** in `components/<slug>/`. Keep all logic pure & client-side — see `lib/json/format.ts` for the pattern.

**3. Create the page** in `app/(tools)/<slug>/page.tsx`:

```tsx
import { ToolPageLayout } from '@/components/tool-page/ToolPageLayout';
import { buildMetadata } from '@/lib/seo/metadata';
import { getRelatedTools, getTool } from '@/lib/tools-registry';
import { Base64Tool } from '@/components/base64-encoder/Base64Tool';

export const metadata = buildMetadata({
  title: 'Base64 Encoder / Decoder — Free Online Tool',
  description: '...',
  path: '/base64-encoder',
  keywords: ['base64 encoder', 'base64 decoder', '...'],
});

export default function Page() {
  const tool = getTool('base64-encoder')!;
  return (
    <ToolPageLayout
      tool={tool}
      hero={{ headline: '...', subheadline: '...' }}
      contentBlocks={[/* SEO long-form content */]}
      faqs={[/* FAQs — auto-emit FAQPage JSON-LD */]}
      relatedTools={getRelatedTools('base64-encoder')}
    >
      <Base64Tool />
    </ToolPageLayout>
  );
}
```

`ToolPageLayout` wires Hero + your tool + an in-page banner ad + content blocks + FAQ + related tools, plus emits SoftwareApplication and BreadcrumbList JSON-LD. You don't have to touch SEO again.

---

## SEO

- **Metadata.** Every page calls `buildMetadata({ title, description, path, keywords })`. This generates canonical URLs, OG, Twitter cards, robots tags. Don't roll your own.
- **JSON-LD.** Use the helpers in `lib/seo/jsonld.ts`: `organizationSchema`, `websiteSchema`, `softwareAppSchema`, `faqSchema`, `breadcrumbSchema`. Render with `<JsonLd data={...} />`.
- **Sitemap & robots.** Auto-generated from the tools registry — only `status: 'live'` tools are included.
- **Long-form content.** Each tool page should ship 3 content blocks (intro, how-to, benefits) + 5–7 FAQs. This is what gets the page indexed for long-tail keywords.

### Domain strategy

**One domain.** All tools live under `quickutils.dev/<slug>` so domain authority compounds.

---

## Ads

Ad components reserve layout space (zero CLS) and lazy-load via IntersectionObserver. They render harmless placeholders when AdSense is not configured.

To enable AdSense:

1. Get approved for AdSense and create ad units.
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXX` in `.env.local`.
3. Pass each ad unit's `slot` ID into `<BannerAd slot="..." />`, `<SidebarAd slot="..." />`, etc.

**Default placements** (already wired into `ToolPageLayout`):

- Banner ad below the tool, above content blocks.
- Add `<SidebarAd />` inside a tool page's two-column layout when desired.
- Add `<MobileStickyAd />` to the root layout if you want a sticky mobile ad globally.

---

## Analytics

Set `NEXT_PUBLIC_GA_ID=G-XXXXXX` and/or `NEXT_PUBLIC_CLARITY_ID=...` in `.env.local`. Both load with `afterInteractive` and don't block first paint.

Track tool events from client components:

```ts
import { track } from '@/components/analytics/Analytics';
track('format_clicked', { tool: 'json-formatter' });
```

---

## Deployment — Cloudflare Pages

The project is configured for Cloudflare Pages via `@cloudflare/next-on-pages`.

**One-time setup**

```bash
pnpm dlx wrangler login
```

In the Cloudflare dashboard, create a Pages project named `quickutils` (or update `wrangler.toml`).

**Manual deploy**

```bash
pnpm pages:build
pnpm pages:deploy
```

**Git-connected deploy** (recommended)

1. Push this repo to GitHub.
2. In Cloudflare → Pages → Create project → Connect to Git.
3. Build command: `npx @cloudflare/next-on-pages`
4. Build output directory: `.vercel/output/static`
5. Add environment variables under Settings → Environment variables (`NEXT_PUBLIC_SITE_URL`, etc.).

### Vercel (alternative)

This project also runs on Vercel with zero config. Click "Import" in Vercel, select the repo, set env vars, deploy.

---

## Performance

- Monaco editor is dynamically imported — never on the critical path.
- Fonts use `display: swap` and Next's `next/font/google` for self-hosting.
- `optimizePackageImports` is enabled for `lucide-react` and `framer-motion`.
- Ad slots reserve height to keep CLS at zero.
- Tailwind purges unused classes; no global CSS frameworks loaded.

Lighthouse target: 95+ on every metric.

---

## License

MIT.
