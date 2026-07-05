interface DescriptionProps {
  description: string;
  extended?: string;
}

export function Description({ description, extended }: DescriptionProps) {
  return (
    <section className="border-b border-outline-variant/30 pb-10 mb-10">
      <p className="font-body-lg text-on-surface-variant leading-relaxed mb-4">{description}</p>
      {extended && (
        <p className="font-body-lg text-on-surface-variant leading-relaxed">{extended}</p>
      )}
    </section>
  );
}
