import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { generateSlug, calculateReadTime } from '@/lib/utils';
import { extractMediaFromContent, replaceMediaWithPlaceholders } from '@/lib/mediaProcessor';

// GET /api/blogs - Fetch blogs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'newest';
    const published = searchParams.get('published') !== 'false';

    // Build query
    const query: any = {};
    if (published) query.published = true;
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };

    // Build sort
    let sortQuery: any = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { publishedAt: 1 };
        break;
      case 'popular':
        sortQuery = { views: -1, publishedAt: -1 };
        break;
      case 'newest':
      default:
        sortQuery = { publishedAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      blogs: blogs.map((blog: any) => ({
        ...blog,
        _id: blog._id.toString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create new blog
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, content, rawContent, media = [], category, tags, coverImage, published, excerpt, seoTitle, seoDescription } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Generate slug
    const baseSlug = generateSlug(title);
    
    // Ensure slug is not empty or too short
    if (!baseSlug || baseSlug.length < 2) {
      return NextResponse.json(
        { error: 'Title must contain at least 2 valid characters for URL generation' },
        { status: 400 }
      );
    }
    
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate read time
    const readTime = calculateReadTime(content);

    // Generate excerpt if not provided
    const finalExcerpt = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

    // Ensure media array has proper structure
    const processedMedia = Array.isArray(media) ? media.map((item, index) => ({
      type: item.type || 'image',
      url: item.url || '',
      alt: item.alt || '',
      caption: item.caption || '',
      position: item.position || index,
      metadata: item.metadata || {}
    })) : [];

    const blog = new Blog({
      title,
      slug,
      content,
      rawContent: rawContent || content,
      media: processedMedia,
      excerpt: finalExcerpt,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
      coverImage: coverImage || '',
      published: published || false,
      readTime,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || finalExcerpt,
      publishedAt: published ? new Date() : undefined,
    });

    await blog.save();

    return NextResponse.json({
      message: 'Blog created successfully',
      blog: {
        ...blog.toObject(),
        _id: blog._id.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}