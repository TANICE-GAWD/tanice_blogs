'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewTrackerProps {
  blogId: string;
  initialViews: number;
}

export default function ViewTracker({ blogId, initialViews }: ViewTrackerProps) {
  const [views, setViews] = useState(initialViews);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    // Check if user has already viewed this post in this session
    const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]');
    const alreadyViewed = viewedPosts.includes(blogId);

    if (!alreadyViewed && !hasViewed) {
      // Track the view
      trackView();
      setHasViewed(true);
      
      // Mark as viewed in session storage
      viewedPosts.push(blogId);
      sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
    }

    // Set up real-time view updates
    const interval = setInterval(() => {
      fetchCurrentViews();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [blogId, hasViewed]);

  const trackView = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setViews(data.views);
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const fetchCurrentViews = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/views`);
      if (response.ok) {
        const data = await response.json();
        setViews(data.views);
      }
    } catch (error) {
      console.error('Error fetching views:', error);
    }
  };

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
      <Eye size={14} />
      <span>{views.toLocaleString()} {views === 1 ? 'view' : 'views'}</span>
    </div>
  );
}