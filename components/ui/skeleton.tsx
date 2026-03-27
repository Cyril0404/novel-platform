export function SkeletonCard() {
  return (
    <div className="animate-fade-in rounded-xl bg-white p-4 shadow-sm">
      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-20 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
        <div className="h-6 w-full rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
        <div className="h-4 w-24 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
      </div>
    </div>
  );
}

export function SkeletonBookshelf() {
  return (
    <div className="animate-fade-in rounded-xl bg-white shadow-sm">
      <div className="flex">
        <div className="h-32 w-20 rounded-l-lg bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
        <div className="flex flex-1 flex-col justify-center p-4">
          <div className="h-3 w-16 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
          <div className="mt-2 h-5 w-full rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
          <div className="mt-1 h-3 w-24 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
        </div>
      </div>
      <div className="flex border-t border-stone-100">
        <div className="h-10 w-1/2 border-r border-stone-100 bg-gradient-to-r from-stone-50 via-white to-stone-50 animate-shimmer" />
        <div className="h-10 w-1/2 bg-gradient-to-r from-stone-50 via-white to-stone-50 animate-shimmer" />
      </div>
    </div>
  );
}

export function SkeletonReader() {
  return (
    <div className="animate-fade-in mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="space-y-4">
        <div className="h-4 w-32 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
        <div className="h-8 w-64 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
      </div>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-full rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer"
            style={{ width: `${Math.random() * 30 + 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-fade-in rounded-xl bg-white p-4 shadow-sm card-hover opacity-0"
          style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "forwards" }}
        >
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-20 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
            <div className="h-6 w-full rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
            <div className="h-4 w-24 rounded bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
