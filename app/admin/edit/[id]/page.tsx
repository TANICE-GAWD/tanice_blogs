import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import BlogEditor from '@/components/Admin/BlogEditor';

interface EditPostPageProps {
  params: { id: string };
}

async function getPost(id: string) {
  try {
    await dbConnect();
    const post = await Blog.findById(id).lean();
    
    if (!post) return null;

    return {
      _id: (post as any)._id.toString(),
      title: (post as any).title,
      slug: (post as any).slug,
      content: (post as any).content,
      rawContent: (post as any).rawContent || '',
      media: ((post as any).media || []).map((item: any, index: number) => ({
        type: item.type,
        url: item.url,
        alt: item.alt,
        caption: item.caption,
        placeholder: `[media-${index}]`,
        position: item.position,
      })),
      category: (post as any).category,
      tags: (post as any).tags || [],
      coverImage: (post as any).coverImage || '',
      published: (post as any).published,
      excerpt: (post as any).excerpt || '',
      seoTitle: (post as any).seoTitle || '',
      seoDescription: (post as any).seoDescription || '',
      publishedAt: new Date((post as any).publishedAt),
      createdAt: new Date((post as any).createdAt),
      updatedAt: new Date((post as any).updatedAt),
      readTime: (post as any).readTime || 0,
      views: (post as any).views || 0,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const post = await getPost(params.id);
  
  return {
    title: post ? `Edit: ${post.title} - Admin` : 'Post Not Found - Admin',
    description: 'Edit blog post',
    robots: 'noindex, nofollow',
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPost(params.id);
  
  if (!post) {
    notFound();
  }

  return (
    <div>
      <BlogEditor 
        initialData={{
          _id: post._id,
          title: post.title,
          content: post.content,
          rawContent: post.rawContent,
          media: post.media,
          category: post.category,
          tags: post.tags,
          coverImage: post.coverImage,
          published: post.published,
          excerpt: post.excerpt,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
        }}
        isEdit={true}
      />
    </div>
  );
}