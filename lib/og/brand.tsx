import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 } as const;

const BRAND = {
  primary: '#3b6fe8',
  primaryDark: '#2a5fd4',
  bg: '#0d1117',
  bgAccent: '#151b26',
  foreground: '#f1f5f9',
  muted: '#94a3b8',
} as const;

/** Lightning bolt mark in a rounded square — matches the site header. */
export function BrandMark({ size }: { size: number }) {
  const radius = Math.round(size * 0.2);
  const boltSize = Math.round(size * 0.5);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
        boxShadow: `0 ${size * 0.08}px ${size * 0.2}px rgba(59, 111, 232, 0.45)`,
      }}
    >
      <svg
        width={boltSize}
        height={boltSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  );
}

export function OgImageLayout({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '72px 80px',
        background: `linear-gradient(145deg, ${BRAND.bg} 0%, ${BRAND.bgAccent} 55%, ${BRAND.bg} 100%)`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(59,111,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,111,232,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,111,232,0.18) 0%, transparent 70%)',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 32, position: 'relative' }}>
        <BrandMark size={96} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: BRAND.foreground,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 30,
                color: BRAND.muted,
                lineHeight: 1.35,
                maxWidth: 820,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 22,
          color: BRAND.muted,
        }}
      >
        <span
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            background: 'rgba(59,111,232,0.15)',
            color: '#7eb3ff',
            fontWeight: 600,
          }}
        >
          100% browser-based
        </span>
        <span>·</span>
        <span>No signup · No uploads</span>
      </div>
    </div>
  );
}

export function createOgImageResponse(title: string, subtitle?: string) {
  return new ImageResponse(
    <OgImageLayout title={title} subtitle={subtitle} />,
    { ...OG_SIZE },
  );
}

export function createIconImageResponse(size: number) {
  return new ImageResponse(<BrandMark size={size} />, { width: size, height: size });
}
