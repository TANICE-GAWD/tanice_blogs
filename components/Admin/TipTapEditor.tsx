'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useState } from 'react';
import { ImageIcon, Video, Code, LinkIcon, Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';
import toast from 'react-hot-toast';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onMediaInsert?: (type: string, url: string, alt?: string) => Promise<string>; // Returns placeholder
}

export default function TipTapEditor({ content, onChange, onMediaInsert }: TipTapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto',
          },
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg mx-auto my-4 max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 hover:underline',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Insert image at cursor position
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    
    try {
      // Upload to server first
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Insert the uploaded image directly
        editor.chain().focus().setImage({ 
          src: data.url, 
          alt: file.name,
          class: 'rounded-lg mx-auto my-4 max-w-full h-auto'
        }).run();
        
        // Call media insert callback if provided
        if (onMediaInsert) {
          await onMediaInsert('image', data.url, file.name);
        }
        
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (uploadError) {
      console.error('Upload failed:', uploadError);
      toast.error(uploadError instanceof Error ? uploadError.message : 'Upload failed');
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
    
    const mediaId = `video_${Date.now()}`;
    const placeholder = `{{MEDIA:video_${mediaId}}}`;
    
    // Create video embed element
    const videoHtml = `
      <div class="video-embed my-6" data-media-placeholder="${placeholder}">
        <div class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div class="text-center text-white">
            <div class="w-12 h-12 mx-auto mb-2">📹</div>
            <p class="text-gray-300">Video: ${url}</p>
            <p class="text-sm text-gray-500 mt-1">(Will be embedded when published)</p>
          </div>
        </div>
      </div>
    `;
    
    editor.chain().focus().insertContent(videoHtml).run();
    
    // Call media insert callback if provided
    if (onMediaInsert) {
      await onMediaInsert('video', url, 'Video embed');
    }
  };

  // Insert code block
  const insertCodeBlock = () => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
  };

  // Insert link
  const insertLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // Toolbar component
  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="border-b p-2 flex flex-wrap gap-2 items-center bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        {/* Media */}
        <div className="flex items-center space-x-1">
          <label className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImageIcon size={16} />
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
            <Video size={16} />
          </button>
          
          <button
            onClick={insertCodeBlock}
            className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Code Block"
          >
            <Code size={16} />
          </button>
          
          <button
            onClick={insertLink}
            className={`p-2 rounded ${editor.isActive('link') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Link"
          >
            <LinkIcon size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        {/* Lists and Quotes */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title="Blockquote"
          >
            <Quote size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Undo"
            disabled={!editor.can().undo()}
          >
            <Undo size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Redo"
            disabled={!editor.can().redo()}
          >
            <Redo size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <MenuBar />
      <EditorContent editor={editor} />
      {isUploading && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Uploading image...
          </div>
        </div>
      )}
    </div>
  );
}