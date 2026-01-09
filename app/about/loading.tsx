export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-8 animate-pulse"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-6 animate-pulse"></div>
          <div className="flex justify-center space-x-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Achievements Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-12 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-56 mx-auto mb-12 animate-pulse"></div>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4 animate-pulse"></div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto mb-12 animate-pulse"></div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3 justify-center">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Interests Skeleton */}
        <div className="mb-16">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-44 mx-auto mb-12 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Skeleton */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl p-8 animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto mb-6"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-12 w-36 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}