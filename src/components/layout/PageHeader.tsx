export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        {title}
      </h1>
      {description && <p className="mt-2 text-sm text-ash">{description}</p>}
    </div>
  );
}
