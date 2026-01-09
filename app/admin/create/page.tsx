import { Metadata } from 'next';
import BlogEditor from '@/components/Admin/BlogEditor';

export const metadata: Metadata = {
  title: 'Create New Post - Admin',
  description: 'Create a new blog post',
  robots: 'noindex, nofollow',
};

export default function CreatePostPage() {
  return (
    <div>
      <BlogEditor />
    </div>
  );
}