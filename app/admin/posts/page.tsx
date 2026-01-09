import Link from 'next/link';
import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { formatDate, categories } from '@/lib/utils';
import { Edit, Eye, Trash2, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Posts - Admin',
  description: 'Manage all blog posts',
  robots: 'noindex, nofollow',
};

async function getAllPosts() {
  try {
    await dbConnect();
    const posts = await Blog.find()
      .sort({ updatedAt: -1 })
      .lean();

    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      publishedAt: new Date(post.publishedAt),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function AllPostsPage() {
  const posts = await getAllPosts();
  const publishedPosts = posts.filter(post => post.published);
  const draftPosts = posts.filter(post => !post.published);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your blog posts and drafts
          </p>
        </div>
        <Link
          href="/admin/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Posts
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {posts.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Published
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {publishedPosts.length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Drafts
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {draftPosts.length}
          </p>
        </div>
      </div>

      {/* Drafts Section */}
      {draftPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Drafts ({draftPosts.length})
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {draftPosts.map((post) => {
                    const categoryInfo = categories[post.category];
                    return (
                      <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {post.excerpt || 'No excerpt'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                            <span className="mr-1">{categoryInfo.icon}</span>
                            {categoryInfo.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.updatedAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/edit/${post._id}`}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                              title="Edit post"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title="Delete post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Published Posts Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Published Posts ({publishedPosts.length})
        </h2>
        {publishedPosts.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {publishedPosts.map((post) => {
                    const categoryInfo = categories[post.category];
                    return (
                      <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {post.excerpt || 'No excerpt'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                            <span className="mr-1">{categoryInfo.icon}</span>
                            {categoryInfo.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.publishedAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                              title="View post"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={`/admin/edit/${post._id}`}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                              title="Edit post"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title="Delete post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Eye className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No published posts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first blog post to get started.
            </p>
            <Link
              href="/admin/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}