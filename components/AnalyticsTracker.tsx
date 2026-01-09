'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface AnalyticsTrackerProps {
  slug: string;
  category: string;
  title: string;
}

export default function AnalyticsTracker({ slug, category, title }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track page view when component mounts
    trackEvent.viewPost(slug, category);
  }, [slug, category]);

  return null; // This component doesn't render anything
}