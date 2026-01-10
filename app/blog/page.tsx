import { Metadata } from 'next';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All Posts - Tech Blog',
  description: 'Browse all blog posts about system design, data structures, career growth, and startup hiring.',
  openGraph: {
    title: 'All Posts - Tech Blog',
    description: 'Browse all blog posts about system design, data structures, career growth, and startup hiring.',
    type: 'website',
  },
};

async function getAllBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .lean();
    
    return blogs.map((blog: any) => ({
      ...blog,
      _id: blog._id.toString(),
      publishedAt: new Date(blog.publishedAt),
      createdAt: new Date(blog.createdAt),
      updatedAt: new Date(blog.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function AllBlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Posts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse all my articles on system design, data structures, career growth, and startup hiring.
          </p>
          <div className="text-gray-500 dark:text-gray-400 mt-4">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} published
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                title={blog.title}
                excerpt={blog.excerpt || blog.content.substring(0, 150) + '...'}
                category={blog.category}
                publishedAt={blog.publishedAt}
                readTime={blog.readTime}
                slug={blog.slug}
                coverImage={blog.coverImage}
                views={blog.views}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Check back soon for new content!
            </p>
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}