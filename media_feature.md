# Context: Tech Blog Site Development (With Rich Media Support)

## **Updated Database Schema for Media Support (models/Blog.ts)**

```typescript
import mongoose from 'mongoose';

// Sub-schema for media items
const MediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'code', 'gist', 'tweet', 'embed'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  alt: String,
  caption: String,
  width: Number,
  height: Number,
  position: {
    type: Number,
    required: true,
  },
  metadata: mongoose.Schema.Types.Mixed,
});

// Enhanced Blog Schema with Media Support
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
  },
  // Store content as HTML with media placeholders
  content: {
    type: String, // HTML content with {{MEDIA:id}} placeholders
    required: true,
  },
  // Store media separately with their positions
  media: [MediaSchema],
  
  // Store raw content for editing
  rawContent: String,
  
  excerpt: {
    type: String,
    maxlength: 200,
  },
  category: {
    type: String,
    required: true,
    enum: ['system-design', 'dsa', 'linkedin', 'interviews', 'startup-hiring'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  coverImage: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
```

## **Media Upload System (lib/upload.ts)**

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: Buffer, folder: string = 'blog-media') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    uploadStream.end(file);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

// Utility to extract file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
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
```

## **Enhanced TipTap Editor with Media Insertion**

```typescript
// app/components/Admin/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useState } from 'react';
import { ImageIcon, Video, Code, LinkIcon } from 'lucide-react';

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onMediaInsert: (type: string, url: string, alt?: string) => Promise<string>; // Returns placeholder
}

export default function TipTapEditor({ content, onChange, onMediaInsert }: TipTapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg mx-auto my-4 max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 p-4 rounded-lg my-4',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Insert image at cursor position
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    try {
      // Create temporary base64 preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        // Insert temporary image
        editor.chain().focus().setImage({ src: base64, alt: file.name }).run();
        
        // Upload to server
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Replace base64 with actual URL
          const view = editor.view;
          const { from } = view.state.selection;
          const tr = view.state.tr;
          
          // Find and replace the image node
          view.state.doc.descendants((node, pos) => {
            if (node.type.name === 'image' && pos <= from && pos + node.nodeSize >= from) {
              tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                src: data.url,
                'data-media-id': data.mediaId || Date.now().toString(),
              });
            }
          });
          
          view.dispatch(tr);
          
          // Generate placeholder for database storage
          const placeholder = await onMediaInsert('image', data.url, file.name);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Insert video embed
  const insertVideo = async () => {
    if (!editor) return;
    
    const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
    if (!url) return;
    
    const placeholder = await onMediaInsert('video', url, 'Video embed');
    
    // Create video embed element
    const videoHtml = `
      <div class="video-embed my-6" data-media-placeholder="${placeholder}">
        <div class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <Video className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p class="text-gray-300">Video: ${url}</p>
            <p class="text-sm text-gray-500 mt-1">(Will be embedded when published)</p>
          </div>
        </div>
      </div>
    `;
    
    editor.chain().focus().insertContent(videoHtml).run();
  };

  // Insert code block
  const insertCodeBlock = () => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock({ language: 'javascript' }).run();
  };

  // Toolbar component
  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="border-b p-2 flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        <div className="flex items-center space-x-1">
          <label className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
          
          <button
            onClick={insertVideo}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Insert Video"
          >
            <Video className="w-5 h-5" />
          </button>
          
          <button
            onClick={insertCodeBlock}
            className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Code Block"
          >
            <Code className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => {
              const url = window.prompt('URL');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={`p-2 rounded ${editor.isActive('link') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Link"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Ordered List"
          >
            1.
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Blockquote"
          >
            ❝
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <MenuBar />
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] p-4 prose dark:prose-invert max-w-none focus:outline-none"
      />
      {isUploading && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
          Uploading image...
        </div>
      )}
    </div>
  );
}
```

## **Media Processing Utilities (lib/mediaProcessor.ts)**

```typescript
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
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  
  // Extract images
  const images = doc.querySelectorAll('img');
  images.forEach((img, index) => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const mediaId = img.getAttribute('data-media-id') || `img_${Date.now()}_${index}`;
    
    media.push({
      id: mediaId,
      type: 'image',
      url: src,
      alt,
      placeholder: `{{MEDIA:image_${mediaId}}}`,
      position: index,
    });
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
      const videoRegex = new RegExp(`<div[^>]*data-media-placeholder="${item.placeholder}"[^>]*>.*?</div>`, 'gs');
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
```

## **Enhanced Blog Creation API with Media Support**

```typescript
// app/api/blogs/route.ts (POST handler)
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { extractMediaFromContent, replaceMediaWithPlaceholders } from '@/lib/mediaProcessor';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { title, content, category, tags, excerpt, published } = data;
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    // Extract media from content
    const media = extractMediaFromContent(content);
    
    // Replace media with placeholders for storage
    const processedContent = replaceMediaWithPlaceholders(content, media);
    
    // Create blog post
    const blog = new Blog({
      title,
      slug,
      content: processedContent,
      rawContent: content, // Store original content with media
      media,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()),
      excerpt,
      published,
      publishedAt: published ? new Date() : null,
      readTime: Math.ceil(content.split(' ').length / 200), // 200 words per minute
    });
    
    await blog.save();
    
    return NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog post created successfully',
    });
    
  } catch (error: any) {
    console.error('Blog creation error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
```

## **Blog Renderer Component (app/components/BlogRenderer.tsx)**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { renderMediaPlaceholders } from '@/lib/mediaProcessor';

interface BlogRendererProps {
  content: string;
  media: Array<{
    type: string;
    url: string;
    alt?: string;
    caption?: string;
    placeholder: string;
  }>;
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
```

## **Updated Environment Variables**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db?retryWrites=true&w=majority
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Optional: For local development
UPLOAD_PATH=./public/uploads
NODE_ENV=production
```

## **Package.json Updates**

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "mongoose": "^7.5.0",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "@tiptap/extension-image": "^2.1.0",
    "@tiptap/extension-code-block-lowlight": "^2.1.0",
    "lowlight": "^3.0.0",
    "cloudinary": "^1.40.0",
    "date-fns": "^3.0.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.284.0",
    "dompurify": "^3.0.5"
  }
}
```

## **Key Implementation Points for LLM**

1. **Media Storage Strategy**: Media is stored separately from content with position markers
2. **Placeholder System**: Uses `{{MEDIA:type_id}}` placeholders in HTML content
3. **Two-step Processing**: 
   - Extract media from editor content
   - Replace with placeholders for storage
   - Render placeholders back to media when displaying
4. **Supported Media Types**: Images, Videos (YouTube/Vimeo embeds), Code blocks
5. **Position Preservation**: Media keeps its exact position within the text

**How it works:**
1. User adds media in the editor
2. Media gets uploaded and gets a unique ID
3. Content is processed: media elements are replaced with placeholders
4. Placeholders + media metadata are stored in database
5. When rendering, placeholders are replaced with actual media components

**This approach allows:**
- Media at any position (beginning, middle, end)
- Multiple media in one post
- Easy editing and repositioning
- Clean separation of content and media