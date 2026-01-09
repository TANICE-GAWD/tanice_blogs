import { track } from '@vercel/analytics';

// Custom analytics events for the blog
export const trackEvent = {
  // Blog post interactions
  viewPost: (slug: string, category: string) => {
    track('blog_post_view', {
      slug,
      category,
    });
  },

  sharePost: (slug: string, platform: string) => {
    track('blog_post_share', {
      slug,
      platform,
    });
  },

  // Category interactions
  viewCategory: (category: string) => {
    track('category_view', {
      category,
    });
  },

  // Admin interactions
  createPost: (category: string) => {
    track('admin_create_post', {
      category,
    });
  },

  publishPost: (slug: string, category: string) => {
    track('admin_publish_post', {
      slug,
      category,
    });
  },

  // User engagement
  searchQuery: (query: string) => {
    track('search_query', {
      query,
    });
  },

  contactClick: (method: string) => {
    track('contact_click', {
      method, // 'email', 'linkedin', 'twitter', etc.
    });
  },

  // Newsletter/subscription (if you add it later)
  subscribe: (source: string) => {
    track('newsletter_subscribe', {
      source,
    });
  },

  // External link clicks
  externalLinkClick: (url: string, context: string) => {
    track('external_link_click', {
      url,
      context,
    });
  },
};

// Performance tracking
export const trackPerformance = {
  pageLoad: (page: string, loadTime: number) => {
    track('page_load_time', {
      page,
      loadTime,
    });
  },

  imageLoad: (imageUrl: string, loadTime: number) => {
    track('image_load_time', {
      imageUrl,
      loadTime,
    });
  },
};

// Error tracking
export const trackError = {
  jsError: (error: string, page: string) => {
    track('javascript_error', {
      error,
      page,
    });
  },

  apiError: (endpoint: string, status: number) => {
    track('api_error', {
      endpoint,
      status,
    });
  },
};