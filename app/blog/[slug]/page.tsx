import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { formatDate, categories } from '@/lib/utils';
import { Clock, Eye, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPageProps {
  params: { slug: string };
}

async function getBlog(slug: string): Promise<IBlog | null> {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug, published: true }).lean();
    
    if (!blog) return null;

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return {
      ...blog,
      _id: blog._id.toString(),
      publishedAt: new Date(blog.publishedAt),
      createdAt: new Date(blog.createdAt),
      updatedAt: new Date(blog.updatedAt),
      views: blog.views + 1,
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function getRelatedBlogs(category: string, currentSlug: string): Promise<IBlog[]> {
  try {
    await dbConnect();
    const blogs = await Blog.find({
      category,
      published: true,
      slug: { $ne: currentSlug },
    })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

    return blogs.map(blog => ({
      ...blog,
      _id: blog._id.toString(),
      publishedAt: new Date(blog.publishedAt),
      createdAt: new Date(blog.createdAt),
      updatedAt: new Date(blog.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || '',
      type: 'article',
      publishedTime: blog.publishedAt.toISOString(),
      authors: ['Your Name'],
      images: blog.coverImage ? [blog.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || '',
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.category, blog.slug);
  const categoryInfo = categories[blog.category];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
            Home
          </Link>
          <span>/</span>
          <Link 
            href={`/categories/${blog.category}`}
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            {categoryInfo.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{blog.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href={`/categories/${blog.category}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to {categoryInfo.name}
        </Link>

        {/* Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
              <span className="mr-1">{categoryInfo.icon}</span>
              {categoryInfo.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {blog.excerpt}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <time dateTime={blog.publishedAt.toISOString()}>
              {formatDate(blog.publishedAt)}
            </time>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{blog.views} views</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Share Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Share this post
            </h3>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: blog.title,
                    text: blog.excerpt || '',
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  // You could add a toast notification here
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="border-t border-gray-200 dark:border-gray-700 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  href={`/blog/${relatedBlog.slug}`}
                  className="group"
                >
                  <article className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <time dateTime={relatedBlog.publishedAt.toISOString()}>
                        {formatDate(relatedBlog.publishedAt)}
                      </time>
                      <span>{relatedBlog.readTime} min read</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}