import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
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
      ...post,
      _id: post._id.toString(),
      publishedAt: new Date(post.publishedAt),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
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