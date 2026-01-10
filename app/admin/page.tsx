import Link from 'next/link';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { formatDate, categories } from '@/lib/utils';
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getDashboardStats() {
  try {
    await dbConnect();
    
    // Force fresh queries by adding a timestamp to bypass any MongoDB query caching
    const timestamp = Date.now();
    
    const [totalPosts, publishedPosts, draftPosts, totalViews] = await Promise.all([
      Blog.countDocuments({}).exec(),
      Blog.countDocuments({ published: true }).exec(),
      Blog.countDocuments({ published: false }).exec(),
      Blog.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).exec().then(result => result[0]?.totalViews || 0),
    ]);

    console.log(`Dashboard stats at ${new Date().toISOString()}:`, {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
    });

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
    };
  }
}

async function getRecentPosts() {
  try {
    await dbConnect();
    const posts = await Blog.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean()
      .exec();

    console.log(`Recent posts count at ${new Date().toISOString()}:`, posts.length);

    return posts.map((post: any) => ({
      ...post,
      _id: post._id.toString(),
      publishedAt: new Date(post.publishedAt),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  // Force dynamic rendering by accessing headers
  const headersList = headers();
  
  const stats = await getDashboardStats();
  const recentPosts = await getRecentPosts();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back! Here&apos;s what&apos;s happening with your blog.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalPosts}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Published
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.publishedPosts}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Drafts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.draftPosts}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Edit className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Views
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/create"
              className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Create New Post
              </span>
            </Link>
            <Link
              href="/admin/posts"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Manage All Posts
              </span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                View Live Site
              </span>
            </a>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Posts
            </h2>
            <Link
              href="/admin/posts"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => {
                const categoryInfo = categories[(post as any).category as keyof typeof categories];
                return (
                  <div
                    key={post._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryInfo.color}`}>
                          {categoryInfo.icon} {categoryInfo.name}
                        </span>
                        {!post.published && (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Updated {formatDate(post.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/admin/edit/${post._id}`}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit size={16} />
                      </Link>
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                        >
                          <Eye size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No posts yet
              </p>
              <Link
                href="/admin/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}