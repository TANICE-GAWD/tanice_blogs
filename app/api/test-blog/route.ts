import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Create a simple test blog without media
    const testBlog = new Blog({
      title: 'Test Blog Post',
      slug: 'test-blog-post-' + Date.now(),
      content: '<p>This is a test blog post without media.</p>',
      rawContent: '<p>This is a test blog post without media.</p>',
      media: [], // Empty media array
      excerpt: 'This is a test blog post',
      category: 'system-design',
      tags: ['test'],
      published: false,
      readTime: 1,
    });

    await testBlog.save();

    return NextResponse.json({
      success: true,
      message: 'Test blog created successfully',
      blog: {
        id: testBlog._id.toString(),
        title: testBlog.title,
        slug: testBlog.slug,
      },
    });
  } catch (error) {
    console.error('Test blog creation error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    }, { status: 500 });
  }
}