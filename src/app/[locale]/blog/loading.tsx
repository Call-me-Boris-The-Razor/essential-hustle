export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32">
      {/* Title skeleton */}
      <div className="mb-12 space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-surface-2" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-surface-2" />
      </div>

      {/* Post cards skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border p-6"
          >
            <div className="mb-3 flex gap-2">
              <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
            </div>
            <div className="h-6 w-2/3 animate-pulse rounded bg-surface-2" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-surface-2" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-surface-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
