import Script from 'next/script';

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

/**
 * Loads Google Analytics 4 and Microsoft Clarity if their IDs are configured.
 * Both are loaded with `afterInteractive` so they don't block first paint.
 *
 * Tracking is opt-in via env vars — nothing is shipped if IDs are missing.
 */
export function Analytics() {
  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}

/**
 * Lightweight typed event helper for tool interactions.
 * Use from client components: `track('format_clicked', { tool: 'json-formatter' })`.
 */
export function track(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    gtag?: (cmd: string, name: string, params?: Record<string, unknown>) => void;
  };
  if (typeof w.gtag === 'function') {
    w.gtag('event', name, params ?? {});
  }
}
