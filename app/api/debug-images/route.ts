import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get all blogs with cover images
    const blogsWithImages = await Blog.find({ 
      coverImage: { $exists: true, $ne: '' } 
    }).select('title coverImage published').lean();
    
    console.log('Blogs with cover images:', blogsWithImages.length);
    
    blogsWithImages.forEach((blog, index) => {
      console.log(`Blog ${index + 1}:`, {
        title: blog.title,
        published: blog.published,
        coverImage: blog.coverImage,
        imageLength: blog.coverImage?.length,
        isValidUrl: blog.coverImage?.startsWith('http')
      });
    });
    
    return NextResponse.json({
      totalBlogsWithImages: blogsWithImages.length,
      blogs: blogsWithImages.map((blog: any) => ({
        _id: blog._id.toString(),
        title: blog.title,
        published: blog.published,
        coverImage: blog.coverImage,
        imageLength: blog.coverImage?.length,
        isValidUrl: blog.coverImage?.startsWith('http')
      }))
    });
  } catch (error) {
    console.error('Debug images error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}