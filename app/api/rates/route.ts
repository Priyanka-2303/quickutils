import { NextRequest, NextResponse } from 'next/server';

const FRANKFURTER = 'https://api.frankfurter.app';

/**
 * Proxy endpoint for Frankfurter exchange rates.
 * Runs server-side so there are no CORS issues, and Next.js caches
 * the upstream response for 1 hour via the `revalidate` directive.
 *
 * Usage: GET /api/rates?base=USD
 */
export async function GET(request: NextRequest) {
  const base = request.nextUrl.searchParams.get('base') ?? 'USD';

  try {
    const res = await fetch(`${FRANKFURTER}/latest?from=${base}`, {
      next: { revalidate: 3600 }, // cache 1 hour on the server
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Upstream API error' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 502 },
    );
  }
}
