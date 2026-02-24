export const SectionDivider = () => (
  <div className="mx-auto max-w-7xl px-6">
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="h-1.5 w-1.5 rounded-full bg-accent opacity-40" />
      <div className="h-px w-8 bg-border-light" />
      <div className="h-1.5 w-1.5 rounded-full bg-accent-2 opacity-30" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  </div>
);
