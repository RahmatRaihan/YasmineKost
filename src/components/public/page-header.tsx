export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border/70 bg-secondary/40">
      <div className="container py-10 duration-700 animate-in fade-in slide-in-from-bottom-3 md:py-14">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
