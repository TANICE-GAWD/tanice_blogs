import Link from 'next/link';
import { categories } from '@/lib/utils';

interface CategoryCardProps {
  category: keyof typeof categories;
  postCount: number;
}

export default function CategoryCard({ category, postCount }: CategoryCardProps) {
  const categoryInfo = categories[category];

  return (
    <Link href={`/categories/${category}`}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{categoryInfo.icon}</div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {postCount} {postCount === 1 ? 'post' : 'posts'}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {categoryInfo.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {getCategoryDescription(category)}
        </p>
      </div>
    </Link>
  );
}

function getCategoryDescription(category: keyof typeof categories): string {
  const descriptions = {
    'system-design': 'Learn about scalable architecture, distributed systems, and design patterns.',
    'dsa': 'Master data structures and algorithms with practical examples and explanations.',
    'linkedin': 'Build your professional network and optimize your LinkedIn presence.',
    'interviews': 'Ace technical interviews with tips, strategies, and practice problems.',
    'startup-hiring': 'Insights into startup culture, hiring processes, and team building.',
  };
  
  return descriptions[category];
}