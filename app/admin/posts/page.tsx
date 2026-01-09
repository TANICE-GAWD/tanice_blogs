import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import AllPostsClient from './AllPostsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All Posts - Admin',
  description: 'Manage all blog posts',
  robots: 'noindex, nofollow',
};

async function getAllPosts() {
  try {
    await dbConnect();
    console.log('Fetching all posts for admin...');
    
    const posts = await Blog.find()
      .sort({ updatedAt: -1 })
      .lean();

    console.log('All posts found:', posts.length);
    console.log('Posts details:', posts.map(p => ({
      title: p.title,
      published: p.published,
      publishedAt: p.publishedAt,
      updatedAt: p.updatedAt
    })));

    return posts.map((post: any) => ({
      ...post,
      _id: post._id.toString(),
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function AllPostsPage() {
  const posts = await getAllPosts();
  const publishedCount = posts.filter(post => post.published).length;
  const draftCount = posts.filter(post => !post.published).length;

  console.log('AllPostsPage server-side:', {
    totalPosts: posts.length,
    publishedCount,
    draftCount
  });

  return (
    <AllPostsClient 
      initialPosts={posts}
      publishedCount={publishedCount}
      draftCount={draftCount}
    />
  );
}