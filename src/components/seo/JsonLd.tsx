/**
 * Renders one or more JSON-LD graphs into the document.
 *
 * Server-only by design: structured data must be in the initial HTML for
 * crawlers that do not execute JavaScript.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const graphs = Array.isArray(data) ? data : [data];

  return (
    <>
      {graphs.map((graph, index) => (
        <script
          key={index}
          type="application/ld+json"
          // The payload is built from our own catalog, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      ))}
    </>
  );
}
