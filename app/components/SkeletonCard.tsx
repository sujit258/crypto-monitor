export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header skeleton */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
        </div>
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Body skeleton */}
      <div className="px-5 pb-5 pt-1 space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
        </div>

        <div className="pt-3 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
