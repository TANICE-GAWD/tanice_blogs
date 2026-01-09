import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { formatDate, categories } from '@/lib/utils';
import { Clock, ArrowLeft } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import ViewTracker from '@/components/ViewTracker';
import BlogRenderer from '@/components/BlogRenderer';
import AnalyticsTracker from '@/components/AnalyticsTracker';

interface BlogPageProps {
  params: { slug: string };
}

async function getBlog(slug: string) {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug, published: true }).lean();
    
    if (!blog) return null;

    // Don't increment views here anymore - let the client component handle it
    return {
      ...blog,
      _id: (blog as any)._id.toString(),
      publishedAt: new Date((blog as any).publishedAt),
      createdAt: new Date((blog as any).createdAt),
      updatedAt: new Date((blog as any).updatedAt),
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function getRelatedBlogs(category: string, currentSlug: string) {
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

    return blogs.map((blog: any) => ({
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
    title: (blog as any).seoTitle || (blog as any).title,
    description: (blog as any).seoDescription || (blog as any).excerpt,
    openGraph: {
      title: (blog as any).title,
      description: (blog as any).excerpt || '',
      type: 'article',
      publishedTime: (blog as any).publishedAt.toISOString(),
      authors: ['TANICE'],
      images: (blog as any).coverImage ? [(blog as any).coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: (blog as any).title,
      description: (blog as any).excerpt || '',
      images: (blog as any).coverImage ? [(blog as any).coverImage] : [],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs((blog as any).category, (blog as any).slug);
  const categoryInfo = categories[(blog as any).category as keyof typeof categories];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <AnalyticsTracker 
        slug={(blog as any).slug}
        category={(blog as any).category}
        title={(blog as any).title}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
            Home
          </Link>
          <span>/</span>
          <Link 
            href={`/categories/${(blog as any).category}`}
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            {categoryInfo.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{(blog as any).title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href={`/categories/${(blog as any).category}`}
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
            {(blog as any).title}
          </h1>

          {/* Excerpt */}
          {(blog as any).excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {(blog as any).excerpt}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <time dateTime={(blog as any).publishedAt.toISOString()}>
              {formatDate((blog as any).publishedAt)}
            </time>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{(blog as any).readTime} min read</span>
            </div>
            <ViewTracker blogId={(blog as any).slug} initialViews={(blog as any).views} />
          </div>

          {/* Tags */}
          {(blog as any).tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(blog as any).tags.map((tag: any) => (
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
          {(blog as any).coverImage && (
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
              <Image
                src={(blog as any).coverImage}
                alt={(blog as any).title}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: (blog as any).content }}
        />

        {/* Share Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Share this post
            </h3>
            <ShareButton 
              title={(blog as any).title}
              excerpt={(blog as any).excerpt || ''}
              slug={(blog as any).slug}
            />
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