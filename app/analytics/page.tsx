import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { categories } from '@/lib/utils';
import { 
  Eye, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock,
  BarChart3,
  Target,
  Award,
  BookOpen
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics & Metrics | TANICE',
  description: 'Blog performance metrics, audience insights, and content analytics showcasing technical writing impact and reach.',
  keywords: 'blog analytics, content metrics, technical writing, audience reach, performance data',
};

interface AnalyticsData {
  totalViews: number;
  totalPosts: number;
  publishedPosts: number;
  totalReadTime: number;
  avgViewsPerPost: number;
  mostViewedPost: {
    title: string;
    views: number;
    slug: string;
    category: string;
  } | null;
  categoryStats: Array<{
    category: string;
    postCount: number;
    totalViews: number;
    avgViews: number;
  }>;
  monthlyStats: Array<{
    month: string;
    posts: number;
    views: number;
  }>;
  recentPerformance: {
    last7Days: number;
    last30Days: number;
    last90Days: number;
  };
  engagementMetrics: {
    postsWithViews: number;
    engagementRate: number;
    topPerformingCategory: string;
  };
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  await dbConnect();

  // Get all published blogs
  const blogs = await Blog.find({ published: true }).lean();
  
  // Calculate basic metrics
  const totalPosts = await Blog.countDocuments();
  const publishedPosts = blogs.length;
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalReadTime = blogs.reduce((sum, blog) => sum + (blog.readTime || 0), 0);
  const avgViewsPerPost = publishedPosts > 0 ? Math.round(totalViews / publishedPosts) : 0;

  // Find most viewed post
  const mostViewedPost = blogs.length > 0 
    ? blogs.reduce((max, blog) => (blog.views || 0) > (max.views || 0) ? blog : max)
    : null;

  // Category statistics
  const categoryMap = new Map();
  blogs.forEach(blog => {
    const cat = blog.category;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { postCount: 0, totalViews: 0 });
    }
    const stats = categoryMap.get(cat);
    stats.postCount++;
    stats.totalViews += blog.views || 0;
  });

  const categoryStats = Array.from(categoryMap.entries()).map(([category, stats]) => ({
    category,
    postCount: stats.postCount,
    totalViews: stats.totalViews,
    avgViews: Math.round(stats.totalViews / stats.postCount)
  })).sort((a, b) => b.totalViews - a.totalViews);

  // Monthly statistics (last 12 months)
  const now = new Date();
  const monthlyMap = new Map();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toISOString().slice(0, 7);
    monthlyMap.set(monthKey, { posts: 0, views: 0 });
  }

  blogs.forEach(blog => {
    if (blog.publishedAt) {
      const monthKey = blog.publishedAt.toISOString().slice(0, 7);
      if (monthlyMap.has(monthKey)) {
        const stats = monthlyMap.get(monthKey);
        stats.posts++;
        stats.views += blog.views || 0;
      }
    }
  });

  const monthlyStats = Array.from(monthlyMap.entries()).map(([month, stats]) => ({
    month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    posts: stats.posts,
    views: stats.views
  }));

  // Recent performance
  const now_ms = now.getTime();
  const day_ms = 24 * 60 * 60 * 1000;
  
  const recentPerformance = {
    last7Days: blogs.filter(blog => 
      blog.lastViewed && (now_ms - new Date(blog.lastViewed).getTime()) <= 7 * day_ms
    ).reduce((sum, blog) => sum + (blog.views || 0), 0),
    last30Days: blogs.filter(blog => 
      blog.lastViewed && (now_ms - new Date(blog.lastViewed).getTime()) <= 30 * day_ms
    ).reduce((sum, blog) => sum + (blog.views || 0), 0),
    last90Days: blogs.filter(blog => 
      blog.lastViewed && (now_ms - new Date(blog.lastViewed).getTime()) <= 90 * day_ms
    ).reduce((sum, blog) => sum + (blog.views || 0), 0)
  };

  // Engagement metrics
  const postsWithViews = blogs.filter(blog => (blog.views || 0) > 0).length;
  const engagementRate = publishedPosts > 0 ? Math.round((postsWithViews / publishedPosts) * 100) : 0;
  const topPerformingCategory = categoryStats.length > 0 ? categoryStats[0].category : '';

  return {
    totalViews,
    totalPosts,
    publishedPosts,
    totalReadTime,
    avgViewsPerPost,
    mostViewedPost: mostViewedPost ? {
      title: mostViewedPost.title,
      views: mostViewedPost.views || 0,
      slug: mostViewedPost.slug,
      category: mostViewedPost.category
    } : null,
    categoryStats,
    monthlyStats,
    recentPerformance,
    engagementMetrics: {
      postsWithViews,
      engagementRate,
      topPerformingCategory
    }
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    icon: any; 
    trend?: string;
  }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value.toLocaleString()}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Analytics & Performance Metrics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Comprehensive analytics showcasing content performance, audience engagement, and technical writing impact across system design, DSA, career insights, and startup hiring topics.
          </p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Audience Reach"
            value={data.totalViews}
            subtitle="Cumulative blog views"
            icon={Eye}
            trend={`${data.avgViewsPerPost} avg per post`}
          />
          <MetricCard
            title="Published Articles"
            value={data.publishedPosts}
            subtitle={`${data.totalPosts} total posts`}
            icon={FileText}
          />
          <MetricCard
            title="Content Volume"
            value={`${data.totalReadTime} min`}
            subtitle="Total reading time"
            icon={Clock}
          />
          <MetricCard
            title="Engagement Rate"
            value={`${data.engagementMetrics.engagementRate}%`}
            subtitle={`${data.engagementMetrics.postsWithViews} posts with views`}
            icon={TrendingUp}
          />
        </div>

        {/* Performance Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Award className="h-5 w-5 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performance</h2>
            </div>
            {data.mostViewedPost ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Most Viewed Article</p>
                  <p className="font-medium text-gray-900 dark:text-white">{data.mostViewedPost.title}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {data.mostViewedPost.views.toLocaleString()} views • {categories[data.mostViewedPost.category as keyof typeof categories]?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {categories[data.engagementMetrics.topPerformingCategory as keyof typeof categories]?.name}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No performance data available yet.</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Performance</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 days</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.recentPerformance.last7Days.toLocaleString()} views
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.recentPerformance.last30Days.toLocaleString()} views
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last 90 days</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.recentPerformance.last90Days.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center mb-6">
            <Target className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content Category Performance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.categoryStats.map((category) => {
              const categoryInfo = categories[category.category as keyof typeof categories];
              return (
                <div key={category.category} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">{categoryInfo?.icon}</span>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {categoryInfo?.name || category.category}
                    </h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Posts:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{category.postCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Views:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{category.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Views:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{category.avgViews}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resume Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center mb-4">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Writing Impact Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Content Authority</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• {data.publishedPosts} published technical articles</li>
                <li>• {data.totalReadTime} minutes of educational content</li>
                <li>• {data.categoryStats.length} specialized topic areas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Audience Reach</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• {data.totalViews.toLocaleString()} total content views</li>
                <li>• {data.avgViewsPerPost} average views per article</li>
                <li>• {data.engagementMetrics.engagementRate}% content engagement rate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Expertise Areas</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {data.categoryStats.slice(0, 3).map((cat) => (
                  <li key={cat.category}>
                    • {categories[cat.category as keyof typeof categories]?.name} ({cat.postCount} posts)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}