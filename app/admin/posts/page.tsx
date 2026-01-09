import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import AllPostsClient from './AllPostsClient';

export const metadata: Metadata = {
  title: 'All Posts - Admin',
  description: 'Manage all blog posts',
  robots: 'noindex, nofollow',
};

async function getAllPosts() {
  try {
    await dbConnect();
    const posts = await Blog.find()
      .sort({ updatedAt: -1 })
      .lean();

    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      publishedAt: new Date(post.publishedAt),
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

  return (
    <AllPostsClient 
      initialPosts={posts}
      publishedCount={publishedCount}
      draftCount={draftCount}
    />
  );
}