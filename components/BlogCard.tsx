'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatDate, categories } from '@/lib/utils';
import { Clock, Eye, Building2, Calculator, Linkedin, Target, Rocket } from 'lucide-react';

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

const iconMap = {
  Building2,
  Calculator,
  Linkedin,
  Target,
  Rocket,
};

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
  const [imageError, setImageError] = useState(false);
  const IconComponent = iconMap[categoryInfo.icon as keyof typeof iconMap];

  return (
    <Link href={`/blog/${slug}`} className="block">
      <article className="post-card py-8 sm:py-10 md:py-12 border-b border-gray-100 dark:border-gray-800 last:border-b-0 cursor-pointer">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-8">
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category */}
            <div className="mb-2 sm:mb-3">
              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-sans font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {IconComponent && <IconComponent size={12} className="mr-1 sm:mr-1.5 sm:w-3.5 sm:h-3.5" />}
                <span className="hidden xs:inline">{categoryInfo.name}</span>
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              {title}
            </h2>

            {/* Excerpt */}
            <p className="font-serif text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {excerpt}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm font-sans text-gray-500 dark:text-gray-500">
              <time dateTime={publishedAt.toISOString()} className="flex-shrink-0">
                {formatDate(publishedAt)}
              </time>
              <div className="flex items-center gap-1">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{views.toLocaleString()} {views === 1 ? 'view' : 'views'}</span>
              </div>
            </div>
          </div>

          {/* Cover Image - Responsive */}
          {coverImage && !imageError && (
            <div className="w-full h-40 sm:h-48 lg:w-40 lg:h-28 xl:w-48 xl:h-32 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 order-first lg:order-last">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-contain"
                unoptimized
                onError={() => setImageError(true)}
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}