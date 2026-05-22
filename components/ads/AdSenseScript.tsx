import Script from 'next/script';

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Loads the AdSense library exactly once. Only renders when configured.
 * Should be mounted in the root layout so all pages share a single load.
 */
export function AdSenseScript() {
  if (!adsenseClient) return null;
  return (
    <Script
      id="adsense-init"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
      crossOrigin="anonymous"
    />
  );
}
