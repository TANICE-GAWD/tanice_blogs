import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { categories } from '@/lib/utils';
import { ArrowLeft, Building2, Calculator, Linkedin, Target, Rocket, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const iconMap = {
  Building2,
  Calculator,
  Linkedin,
  Target,
  Rocket,
};

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center font-sans text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 sm:mb-12 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            {(() => {
              const IconComponent = iconMap[categoryInfo.icon as keyof typeof iconMap];
              return IconComponent ? (
                <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 dark:text-gray-400" />
              ) : (
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
              );
            })()}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            {categoryInfo.name}
          </h1>
          <p className="font-serif text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            {getCategoryDescription(category as keyof typeof categories)}
          </p>
          <div className="font-sans text-sm text-gray-500 dark:text-gray-500">
            {total} {total === 1 ? 'post' : 'posts'} published
          </div>
        </div>

        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="mb-12">
            <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Filter by tags
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link
                href={`/categories/${category}`}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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

        {/* Blog Stream */}
        {blogs.length > 0 ? (
          <>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 pt-12 border-t border-gray-100 dark:border-gray-800">
                {page > 1 && (
                  <Link
                    href={`/categories/${category}?page=${page - 1}${selectedTag ? `&tag=${encodeURIComponent(selectedTag)}` : ''}`}
                    className="px-4 py-2 font-sans text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    Previous
                  </Link>
                )}
                
                <span className="px-4 py-2 font-sans text-sm text-gray-500 dark:text-gray-500">
                  Page {page} of {totalPages}
                </span>
                
                {page < totalPages && (
                  <Link
                    href={`/categories/${category}?page=${page + 1}${selectedTag ? `&tag=${encodeURIComponent(selectedTag)}` : ''}`}
                    className="px-4 py-2 font-sans text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
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