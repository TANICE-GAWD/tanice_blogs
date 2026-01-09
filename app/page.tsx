import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/lib/utils';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { ArrowRight } from 'lucide-react';

async function getRecentBlogs() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean();
    
    return blogs.map(blog => ({
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

async function getFeaturedBlogs() {
  try {
    await dbConnect();
    const featuredBlogs = await Promise.all(
      Object.keys(categories).map(async (category) => {
        const blog = await Blog.findOne({ 
          category, 
          published: true 
        })
        .sort({ views: -1, publishedAt: -1 })
        .lean();
        
        return blog ? {
          ...blog,
          _id: blog._id.toString(),
          publishedAt: new Date(blog.publishedAt),
          createdAt: new Date(blog.createdAt),
          updatedAt: new Date(blog.updatedAt),
        } : null;
      })
    );
    
    return featuredBlogs.filter(Boolean);
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return [];
  }
}

async function getCategoryCounts() {
  try {
    await dbConnect();
    const counts = await Promise.all(
      Object.keys(categories).map(async (category) => {
        const count = await Blog.countDocuments({ 
          category, 
          published: true 
        });
        return { category, count };
      })
    );
    
    return counts.reduce((acc, { category, count }) => {
      acc[category as keyof typeof categories] = count;
      return acc;
    }, {} as Record<keyof typeof categories, number>);
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return Object.keys(categories).reduce((acc, category) => {
      acc[category as keyof typeof categories] = 0;
      return acc;
    }, {} as Record<keyof typeof categories, number>);
  }
}

export default async function HomePage() {
  const [recentBlogs, featuredBlogs, categoryCounts] = await Promise.all([
    getRecentBlogs(),
    getFeaturedBlogs(),
    getCategoryCounts(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Hi, I'm <span className="text-blue-600 dark:text-blue-400">TANICE</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              I write about system design, data structures, career growth, and startup hiring. 
              Practical insights from my experience in tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Learn More About Me
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="#recent-posts"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Read My Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Posts
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Popular posts from each category
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.slice(0, 3).map((blog) => (
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
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Dive deep into topics that matter in tech
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Object.keys(categories).map((category) => (
              <CategoryCard
                key={category}
                category={category as keyof typeof categories}
                postCount={categoryCounts[category as keyof typeof categories]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section id="recent-posts" className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Posts
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Latest insights and tutorials
              </p>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center"
            >
              View All Posts
              <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          
          {recentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
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
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No posts yet. Check back soon for new content!
              </p>
              <Link
                href="/admin"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Admin Panel
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}