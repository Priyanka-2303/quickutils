/**
 * Renders one or more schema.org JSON-LD blobs in a single <script> tag.
 * Always render this in the <head> via a route segment, or inline in a server component.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // schema.org JSON-LD must be inline; React escapes < which Google ignores
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json.length === 1 ? json[0] : json) }}
    />
  );
}
