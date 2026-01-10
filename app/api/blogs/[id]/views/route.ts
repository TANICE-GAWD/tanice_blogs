import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/blogs/[id]/views - Get current view count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    
    // Find blog by ID or slug with fresh data
    let blog = await Blog.findOne({ slug: id }).select('views title').lean().exec();
    if (!blog) {
      blog = await Blog.findById(id).select('views title').lean().exec();
    }

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    console.log(`Views fetched for "${(blog as any).title}": ${(blog as any).views || 0}`);

    return NextResponse.json(
      {
        views: (blog as any).views || 0,
        blogId: (blog as any)._id.toString(),
        title: (blog as any).title,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch views' },
      { status: 500 }
    );
  }
}