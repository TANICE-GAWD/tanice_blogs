'use client';

import { Share2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ShareButtonProps {
  title: string;
  excerpt?: string;
  url?: string;
  slug?: string;
}

export default function ShareButton({ title, excerpt, url, slug }: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || window.location.href;
    
    // Track the share event
    if (slug) {
      trackEvent.sharePost(slug, navigator.share ? 'native' : 'clipboard');
    }
    
    if (navigator.share) {
      navigator.share({
        title,
        text: excerpt || '',
        url: shareUrl,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      }).catch(() => {
        // Fallback: show the URL
        prompt('Copy this link:', shareUrl);
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Share2 size={16} />
      Share
    </button>
  );
}