export function MarketValueSkeleton() {
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
        {/* Back Button Skeleton */}
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-8" />

        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Market Insights Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md"
            >
              {/* Icon Skeleton */}
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 animate-pulse" />
              
              {/* Label Skeleton */}
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse" />
              
              {/* Value Skeleton */}
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse" />
              
              {/* Subtitle Skeleton */}
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Detailed Analysis Card Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-8">
          {/* Title Skeleton */}
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-6 animate-pulse" />

          {/* Description Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>

          {/* List Items Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex gap-3">
                <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}