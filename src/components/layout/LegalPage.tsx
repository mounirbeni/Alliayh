export function LegalPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-headline text-5xl">{title}</h1>
      <p className="mt-5 text-muted-foreground">{description}</p>
    </section>
  );
}
