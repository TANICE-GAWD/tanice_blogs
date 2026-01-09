import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

// GET /api/blogs/[id]/views - Get current view count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    
    // Find blog by ID or slug
    let blog = await Blog.findOne({ slug: id }).select('views title');
    if (!blog) {
      blog = await Blog.findById(id).select('views title');
    }

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      views: blog.views,
      blogId: blog._id.toString(),
      title: blog.title,
    });
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch views' },
      { status: 500 }
    );
  }
}