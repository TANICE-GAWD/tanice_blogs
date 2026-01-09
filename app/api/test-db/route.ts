import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    await dbConnect();
    console.log('Database connected successfully');
    
    // Try to count documents
    const count = await Blog.countDocuments();
    console.log(`Found ${count} blog posts in database`);
    
    // Try to fetch all blogs
    const blogs = await Blog.find().lean();
    console.log('Blogs found:', blogs);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      blogCount: count,
      blogs: blogs.map((blog: any) => ({
        id: blog._id.toString(),
        title: blog.title,
        published: blog.published,
        createdAt: blog.createdAt,
      })),
      connectionString: process.env.MONGODB_URI ? 'Set' : 'Not set',
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionString: process.env.MONGODB_URI ? 'Set' : 'Not set',
    }, { status: 500 });
  }
}