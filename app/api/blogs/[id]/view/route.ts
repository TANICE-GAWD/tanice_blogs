import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

// POST /api/blogs/[id]/view - Track a view
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();
    
    // Get client IP for basic duplicate prevention
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Find blog by ID or slug
    let blog = await Blog.findOne({ slug: id });
    if (!blog) {
      blog = await Blog.findById(id);
    }

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment view count
    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      { 
        $inc: { views: 1 },
        $set: { lastViewed: new Date() }
      },
      { new: true }
    );

    // Log view for analytics (optional)
    console.log(`View tracked for blog "${blog.title}" from IP: ${ip}`);

    return NextResponse.json({
      success: true,
      views: updatedBlog.views,
      blogId: updatedBlog._id.toString(),
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}