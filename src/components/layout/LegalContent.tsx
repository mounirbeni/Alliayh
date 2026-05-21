export type LegalSection = {
  heading: string;
  body: string[];
};

export function LegalContent({
  kicker,
  title,
  lastUpdated,
  sections,
}: {
  kicker?: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-14">
      {kicker && (
        <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{kicker}</p>
      )}
      <h1 className="mt-2 font-headline text-5xl">{title}</h1>
      <p className="mt-3 text-xs text-muted-foreground">{lastUpdated}</p>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-headline text-2xl">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
