import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { categories } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: { category: string };
  searchParams: { page?: string; tag?: string };
}

async function getCategoryBlogs(
  category: string, 
  page: number = 1, 
  tag?: string
): Promise<{ blogs: IBlog[]; total: number; totalPages: number }> {
  try {
    await dbConnect();

    const limit = 12;
    const skip = (page - 1) * limit;

    const query: any = { 
      category, 
      published: true 
    };
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query),
    ]);

    return {
      blogs: blogs.map((blog: any) => ({
        ...blog,
        _id: blog._id.toString(),
        publishedAt: new Date(blog.publishedAt),
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
      })),
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error fetching category blogs:', error);
    return { blogs: [], total: 0, totalPages: 0 };
  }
}

async function getCategoryTags(category: string): Promise<string[]> {
  try {
    await dbConnect();
    const result = await Blog.aggregate([
      { $match: { category, published: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    return result.map(item => item._id);
  } catch (error) {
    console.error('Error fetching category tags:', error);
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = params;
  
  if (!categories[category as keyof typeof categories]) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryInfo = categories[category as keyof typeof categories];
  
  return {
    title: `${categoryInfo.name} - Tech Blog`,
    description: `Read all posts about ${categoryInfo.name.toLowerCase()}. Practical insights and tutorials.`,
    openGraph: {
      title: `${categoryInfo.name} Posts`,
      description: `Read all posts about ${categoryInfo.name.toLowerCase()}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = params;
  const page = parseInt(searchParams.page || '1');
  const selectedTag = searchParams.tag;

  // Check if category exists
  if (!categories[category as keyof typeof categories]) {
    notFound();
  }

  const categoryInfo = categories[category as keyof typeof categories];
  const { blogs, total, totalPages } = await getCategoryBlogs(category, page, selectedTag);
  const tags = await getCategoryTags(category);

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
          <div className="text-6xl mb-4">{categoryInfo.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {categoryInfo.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {getCategoryDescription(category as keyof typeof categories)}
          </p>
          <div className="text-gray-500 dark:text-gray-400">
            {total} {total === 1 ? 'post' : 'posts'} published
          </div>
        </div>

        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filter by tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/categories/${category}`}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedTag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </Link>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/categories/${category}?tag=${encodeURIComponent(tag)}`}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                {page > 1 && (
                  <Link
                    href={`/categories/${category}?page=${page - 1}${selectedTag ? `&tag=${encodeURIComponent(selectedTag)}` : ''}`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                
                <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                
                {page < totalPages && (
                  <Link
                    href={`/categories/${category}?page=${page + 1}${selectedTag ? `&tag=${encodeURIComponent(selectedTag)}` : ''}`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {selectedTag 
                ? `No posts found with the tag "${selectedTag}" in ${categoryInfo.name}.`
                : `No posts published in ${categoryInfo.name} yet. Check back soon!`
              }
            </p>
            {selectedTag && (
              <Link
                href={`/categories/${category}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View all {categoryInfo.name} posts
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryDescription(category: keyof typeof categories): string {
  const descriptions = {
    'system-design': 'Learn about scalable architecture, distributed systems, and design patterns that power modern applications.',
    'dsa': 'Master data structures and algorithms with practical examples, explanations, and real-world applications.',
    'linkedin': 'Build your professional network and optimize your LinkedIn presence to advance your tech career.',
    'interviews': 'Ace technical interviews with tips, strategies, practice problems, and insider insights.',
    'startup-hiring': 'Insights into startup culture, hiring processes, team building, and what it takes to succeed in fast-growing companies.',
  };
  
  return descriptions[category];
}