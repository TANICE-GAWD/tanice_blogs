'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface CategoryTrackerProps {
  category: string;
}

export default function CategoryTracker({ category }: CategoryTrackerProps) {
  useEffect(() => {
    // Track category view when component mounts
    trackEvent.viewCategory(category);
  }, [category]);

  return null; // This component doesn't render anything
}