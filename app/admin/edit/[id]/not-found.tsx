import Link from 'next/link';
import { FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <FileX className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Post Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        The blog post you're looking for doesn't exist or has been deleted.
      </p>
      <div className="flex gap-4">
        <Link
          href="/admin/posts"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to All Posts
        </Link>
        <Link
          href="/admin"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}