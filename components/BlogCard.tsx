import Link from 'next/link';
import Image from 'next/image';
import { formatDate, categories } from '@/lib/utils';
import { Clock } from 'lucide-react';
import ViewTracker from './ViewTracker';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: keyof typeof categories;
  publishedAt: Date;
  readTime: number;
  slug: string;
  coverImage?: string;
  views: number;
}

export default function BlogCard({
  title,
  excerpt,
  category,
  publishedAt,
  readTime,
  slug,
  coverImage,
  views,
}: BlogCardProps) {
  const categoryInfo = categories[category];

  return (
    <Link href={`/blog/${slug}`} className="block">
      <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer">
        {coverImage && (
          <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
              <span className="mr-1">{categoryInfo.icon}</span>
              {categoryInfo.name}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <time dateTime={publishedAt.toISOString()}>
                {formatDate(publishedAt)}
              </time>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{readTime} min read</span>
              </div>
            </div>
            <ViewTracker blogId={slug} initialViews={views} />
          </div>
        </div>
      </article>
    </Link>
  );
}