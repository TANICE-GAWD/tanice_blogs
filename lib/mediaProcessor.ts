// Utility to process blog content and extract media
export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'code' | 'embed';
  url: string;
  alt?: string;
  caption?: string;
  placeholder: string;
  position: number;
}

// Extract media from HTML content
export function extractMediaFromContent(content: string): MediaItem[] {
  const media: MediaItem[] = [];
  
  // Create a temporary DOM element to parse HTML
  if (typeof window !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Extract images
    const images = doc.querySelectorAll('img');
    images.forEach((img, index) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const mediaId = img.getAttribute('data-media-id') || `img_${Date.now()}_${index}`;
      
      if (src && !src.startsWith('data:')) { // Skip base64 images
        media.push({
          id: mediaId,
          type: 'image',
          url: src,
          alt,
          placeholder: `{{MEDIA:image_${mediaId}}}`,
          position: index,
        });
      }
    });
    
    // Extract video embeds
    const videoEmbeds = doc.querySelectorAll('[data-media-placeholder]');
    videoEmbeds.forEach((embed, index) => {
      const placeholder = embed.getAttribute('data-media-placeholder') || '';
      const match = placeholder.match(/\{\{MEDIA:(\w+)_([^}]+)\}\}/);
      
      if (match) {
        const type = match[1];
        const id = match[2];
        
        // Try to extract URL from embed
        let url = '';
        const videoText = embed.textContent || '';
        const urlMatch = videoText.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) url = urlMatch[0];
        
        media.push({
          id,
          type: type as MediaItem['type'],
          url,
          placeholder,
          position: images.length + index,
        });
      }
    });
  }
  
  return media;
}

// Replace media in content with placeholders
export function replaceMediaWithPlaceholders(content: string, media: MediaItem[]): string {
  let processedContent = content;
  
  media.forEach((item) => {
    if (item.type === 'image') {
      // Replace image tags
      const imgRegex = new RegExp(`<img[^>]*data-media-id="${item.id}"[^>]*>`, 'g');
      processedContent = processedContent.replace(imgRegex, item.placeholder);
    } else if (item.type === 'video') {
      // Replace video embeds
      const videoRegex = new RegExp(`<div[^>]*data-media-placeholder="${item.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>.*?</div>`, 'gs');
      processedContent = processedContent.replace(videoRegex, item.placeholder);
    }
  });
  
  return processedContent;
}

// Render media from placeholders
export function renderMediaPlaceholders(content: string, media: MediaItem[]): string {
  let renderedContent = content;
  
  media.forEach((item) => {
    let mediaHtml = '';
    
    switch (item.type) {
      case 'image':
        mediaHtml = `
          <figure class="my-6">
            <div class="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src="${item.url}" 
                alt="${item.alt || ''}" 
                class="w-full h-auto max-h-[500px] object-contain"
                loading="lazy"
              />
            </div>
            ${item.caption ? `<figcaption class="text-center text-gray-600 dark:text-gray-400 mt-2 text-sm">${item.caption}</figcaption>` : ''}
          </figure>
        `;
        break;
        
      case 'video':
        // Convert YouTube URLs to embeds
        let videoEmbed = item.url;
        if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
          const videoId = item.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
          if (videoId) {
            videoEmbed = `https://www.youtube.com/embed/${videoId}`;
          }
        } else if (item.url.includes('vimeo.com')) {
          const videoId = item.url.match(/vimeo\.com\/(\d+)/)?.[1];
          if (videoId) {
            videoEmbed = `https://player.vimeo.com/video/${videoId}`;
          }
        }
        
        mediaHtml = `
          <div class="my-6 video-embed">
            <div class="aspect-video rounded-lg overflow-hidden">
              <iframe 
                src="${videoEmbed}" 
                class="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                frameborder="0"
              ></iframe>
            </div>
            ${item.caption ? `<p class="text-center text-gray-600 dark:text-gray-400 mt-2 text-sm">${item.caption}</p>` : ''}
          </div>
        `;
        break;
    }
    
    renderedContent = renderedContent.replace(item.placeholder, mediaHtml);
  });
  
  return renderedContent;
}

// Utility to generate media placeholder
export function generateMediaPlaceholder(mediaId: string, type: string = 'image'): string {
  return `{{MEDIA:${type}_${mediaId}}}`;
}

// Utility to parse media placeholder
export function parseMediaPlaceholder(placeholder: string): { type: string; id: string } | null {
  const match = placeholder.match(/\{\{MEDIA:(\w+)_([^}]+)\}\}/);
  if (match) {
    return { type: match[1], id: match[2] };
  }
  return null;
}