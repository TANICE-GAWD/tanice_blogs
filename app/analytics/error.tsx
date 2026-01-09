'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Analytics page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Analytics Unavailable
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We&apos;re having trouble loading the analytics data. This might be due to a temporary issue with the database connection.
          </p>
          
          <button
            onClick={reset}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Quick Stats Summary
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              While we fix this issue, you can find basic blog metrics in the admin dashboard or check individual post view counts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}