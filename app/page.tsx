import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { categories } from '@/lib/utils';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { ArrowRight, FileText, Building2, Calculator, Linkedin, Target, Rocket } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const iconMap = {
  Building2,
  Calculator,
  Linkedin,
  Target,
  Rocket,
};

async function getRecentBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(10)
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

export default async function HomePage() {
  const recentBlogs = await getRecentBlogs();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section - Enhanced for User Retention */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Personal Introduction */}
          <div className="mb-6 md:mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Hi, I'm <span className="text-blue-600 dark:text-blue-400">TANICE</span>
            </h1>
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
              I yap about complex tech stuff but in my style.
            </p>
          </div>

          {/* Value Proposition */}
          <div className="mb-8 md:mb-10">
            <p className="font-serif text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-6">
              From system design patterns that scale to career moves that matter I share what I've learned 
              building products and teams in the tech industry.
            </p>
            
            {/* Key Topics - Visual Pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {[
                { label: 'System Design', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                { label: 'Data Structures', color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
                { label: 'Networking', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
                { label: 'Startup Hiring', color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' }
              ].map((topic) => (
                <span
                  key={topic.label}
                  className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${topic.color} border border-current border-opacity-20`}
                >
                  {topic.label}
                </span>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="pt-4">
              <p className="font-sans text-sm text-gray-500 dark:text-gray-500 mb-2">
                Latest insights below ↓
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Feed - Responsive */}
      <section className="px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {recentBlogs.length > 0 ? (
            <>
              {/* Content Stream */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentBlogs.map((blog) => (
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

              {/* Load More Section - Responsive */}
              <div className="py-12 md:py-16 text-center border-t border-gray-100 dark:border-gray-800">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-sans text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 rounded-full hover:border-gray-400 dark:hover:border-gray-500"
                >
                  View all posts
                  <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            /* Empty State - Responsive */
            <div className="py-16 md:py-24 text-center px-4">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No posts yet
                </h2>
                <p className="font-serif text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Check back soon for new content about system design, DSA, and career insights.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section - More User-Friendly */}
      {recentBlogs.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50 dark:bg-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Browse Topics
              </h2>
              <p className="font-serif text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Click on any topic to explore related articles
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {Object.entries(categories).map(([key, category]) => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                return (
                  <Link
                    key={key}
                    href={`/categories/${key}`}
                    className="group inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 font-sans text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    {IconComponent && (
                      <IconComponent 
                        size={16} 
                        className="sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" 
                      />
                    )}
                    <span className="font-medium">{category.name}</span>
                    <ArrowRight 
                      size={14} 
                      className="sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" 
                    />
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <p className="font-sans text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                Each topic contains curated articles and insights
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}