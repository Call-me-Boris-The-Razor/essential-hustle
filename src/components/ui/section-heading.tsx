interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export const SectionHeading = ({ label, title, description }: SectionHeadingProps) => (
  <div className="mb-16">
    <span className="font-mono text-sm tracking-widest uppercase text-accent">
      {label}
    </span>
    <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
      {title}
    </h2>
    {description && (
      <p className="mt-4 max-w-2xl text-lg text-text-secondary">{description}</p>
    )}
  </div>
);
