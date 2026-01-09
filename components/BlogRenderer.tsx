'use client';

import { useEffect, useState } from 'react';
import { renderMediaPlaceholders } from '@/lib/mediaProcessor';

interface MediaItem {
  type: string;
  url: string;
  alt?: string;
  caption?: string;
  placeholder: string;
}

interface BlogRendererProps {
  content: string;
  media: MediaItem[];
  className?: string;
}

export default function BlogRenderer({ content, media, className = '' }: BlogRendererProps) {
  const [renderedContent, setRenderedContent] = useState('');
  
  useEffect(() => {
    // Render media placeholders
    const rendered = renderMediaPlaceholders(content, media);
    setRenderedContent(rendered);
  }, [content, media]);
  
  return (
    <article 
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}