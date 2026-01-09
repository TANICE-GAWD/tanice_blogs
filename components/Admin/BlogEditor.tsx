'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { categories, generateSlug } from '@/lib/utils';
import { extractMediaFromContent, replaceMediaWithPlaceholders } from '@/lib/mediaProcessor';
import toast from 'react-hot-toast';
import TipTapEditor from './TipTapEditor';
import ImageUpload from './ImageUpload';
import { 
  Eye,
  Save,
  Send
} from 'lucide-react';

interface BlogEditorProps {
  initialData?: {
    _id?: string;
    title: string;
    content: string;
    rawContent?: string;
    media?: Array<{
      type: string;
      url: string;
      alt?: string;
      caption?: string;
      placeholder: string;
      position: number;
    }>;
    category: string;
    tags: string[];
    coverImage?: string;
    published: boolean;
    excerpt?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
  isEdit?: boolean;
}

export default function BlogEditor({ initialData, isEdit = false }: BlogEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState(initialData?.rawContent || initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'system-design');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [mediaItems, setMediaItems] = useState(initialData?.media || []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !isEdit) {
      setSlug(generateSlug(title));
    }
  }, [title, isEdit]);

  const handleMediaInsert = async (type: string, url: string, alt?: string): Promise<string> => {
    const mediaId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const placeholder = `{{MEDIA:${type}_${mediaId}}}`;
    
    const newMediaItem = {
      type: type as 'image' | 'video' | 'code' | 'embed',
      url,
      alt,
      placeholder,
      position: mediaItems.length,
    };
    
    setMediaItems(prev => [...prev, newMediaItem]);
    return placeholder;
  };

  const handleSave = async (publish: boolean = false) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsSaving(true);

    try {
      // Start with basic media processing - only handle uploaded images
      let processedMedia = [];
      
      // Only process media if we have any
      if (mediaItems.length > 0) {
        processedMedia = mediaItems.map((item, index) => ({
          type: item.type || 'image',
          url: item.url || '',
          alt: item.alt || '',
          caption: item.caption || '',
          position: index,
          metadata: {}
        }));
      }
      
      const blogData = {
        title: title.trim(),
        content: content,
        rawContent: content,
        media: processedMedia,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        coverImage: coverImage.trim(),
        excerpt: excerpt.trim(),
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim(),
        published: publish,
      };

      console.log('Sending blog data with media:', JSON.stringify(blogData, null, 2));

      const url = isEdit ? `/api/blogs/${initialData?._id}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save blog');
      }

      const result = await response.json();
      
      toast.success(
        publish 
          ? `Blog ${isEdit ? 'updated and published' : 'published'} successfully!`
          : `Blog ${isEdit ? 'updated' : 'saved as draft'} successfully!`
      );

      if (!isEdit) {
        router.push('/admin/posts');
      } else {
        // Stay on the edit page after saving
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save blog');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/posts"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Posts
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEdit ? 'Edit Post' : 'Create New Post'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Eye size={16} />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* Slug Display */}
          {slug && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              URL: /blog/{slug}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="react, javascript, tutorial"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Cover Image */}
            <div className="md:col-span-2">
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                label="Cover Image (optional)"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt (optional)
              </label>
              <textarea
                placeholder="Brief description of your post..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* SEO Fields Toggle */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setShowSeoFields(!showSeoFields)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                {showSeoFields ? 'Hide' : 'Show'} SEO Fields
              </button>
            </div>

            {/* SEO Fields */}
            {showSeoFields && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    placeholder="SEO optimized title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    placeholder="SEO meta description"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="p-6">
          {!isPreview && (
            <TipTapEditor
              content={content}
              onChange={setContent}
              onMediaInsert={handleMediaInsert}
            />
          )}

          {/* Preview */}
          {isPreview && (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Preview
              </h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}