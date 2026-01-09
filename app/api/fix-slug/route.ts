import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Find the blog with slug "d"
    const blog = await Blog.findOne({ slug: 'd' });
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog with slug "d" not found' }, { status: 404 });
    }
    
    // Generate a proper slug from the title
    const newSlug = generateSlug(blog.title);
    
    // Update the blog with the new slug
    await Blog.findByIdAndUpdate(blog._id, { slug: newSlug });
    
    return NextResponse.json({
      message: 'Slug fixed successfully',
      oldSlug: 'd',
      newSlug: newSlug,
      title: blog.title
    });
  } catch (error) {
    console.error('Fix slug error:', error);
    return NextResponse.json(
      { error: 'Failed to fix slug', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}