export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation Bar Skeleton */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Quick Links Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md"
            >
              {/* Icon Skeleton */}
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 animate-pulse" />
              
              {/* Title Skeleton */}
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse" />
              
              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}