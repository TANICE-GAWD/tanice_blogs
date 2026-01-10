import { Metadata } from 'next';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { ArrowLeft, FileText } from 'lucide-react';

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
      .lean()
      .exec();
    
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button - Responsive */}
        <Link
          href="/"
          className="inline-flex items-center font-sans text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 sm:mb-12 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        {/* Header - Responsive */}
        <div className="mb-12 sm:mb-16">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            All Posts
          </h1>
          <p className="font-serif text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Browse all my articles on system design, data structures, career growth, and startup hiring.
          </p>
          <div className="font-sans text-sm text-gray-500 dark:text-gray-500 mt-4 sm:mt-6">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} published
          </div>
        </div>

        {/* Blog Stream - Responsive */}
        {blogs.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                title={blog.title}
                excerpt={blog.excerpt || blog.content.substring(0, 200) + '...'}
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
          <div className="text-center py-16 sm:py-24">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No posts yet
              </h2>
              <p className="font-serif text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                Check back soon for new content about system design, DSA, and career insights.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-sans text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400 dark:hover:border-gray-500"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}