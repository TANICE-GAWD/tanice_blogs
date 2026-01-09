import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get all blogs (published and unpublished) for debugging
    const allBlogs = await Blog.find({}).lean();
    const publishedBlogs = await Blog.find({ published: true }).lean();
    
    console.log('All blogs in database:', allBlogs.length);
    console.log('Published blogs:', publishedBlogs.length);
    
    // Log details of each blog
    allBlogs.forEach((blog, index) => {
      console.log(`Blog ${index + 1}:`, {
        title: blog.title,
        published: blog.published,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt
      });
    });
    
    return NextResponse.json({
      totalBlogs: allBlogs.length,
      publishedBlogs: publishedBlogs.length,
      blogs: allBlogs.map((blog: any) => ({
        _id: blog._id.toString(),
        title: blog.title,
        published: blog.published,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}