import { Metadata } from 'next';
import Link from 'next/link';
import { Eye, TrendingUp, Users, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics - Admin',
  description: 'View blog analytics and statistics',
  robots: 'noindex, nofollow',
};

async function getAnalytics() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/analytics/views`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalViews: 0,
      mostViewed: [],
      viewsByCategory: [],
      recentActivity: [],
    };
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your blog&apos;s performance and engagement
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Views
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Most Viewed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.mostViewed[0]?.views.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.viewsByCategory.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.recentActivity.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed Posts */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Most Viewed Posts
            </h2>
          </div>
          <div className="p-6">
            {analytics.mostViewed.length > 0 ? (
              <div className="space-y-4">
                {analytics.mostViewed.slice(0, 5).map((post: any, index: number) => (
                  <div key={post._id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium truncate block"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {post.category.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Eye size={14} />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No view data available yet
              </p>
            )}
          </div>
        </div>

        {/* Views by Category */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Views by Category
            </h2>
          </div>
          <div className="p-6">
            {analytics.viewsByCategory.length > 0 ? (
              <div className="space-y-4">
                {analytics.viewsByCategory.map((category: any) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-900 dark:text-white font-medium capitalize">
                          {category._id.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {category.totalViews.toLocaleString()} views
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((category.totalViews / analytics.totalViews) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No category data available yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}