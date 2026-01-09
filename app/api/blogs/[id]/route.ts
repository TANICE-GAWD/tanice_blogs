import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { generateSlug, calculateReadTime } from '@/lib/utils';

// GET /api/blogs/[id] - Get single blog by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    
    // Try to find by slug first, then by ID
    let blog = await Blog.findOne({ slug: id }).lean() as IBlog | null;
    if (!blog) {
      blog = await Blog.findById(id).lean() as IBlog | null;
    }

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return NextResponse.json({
      ...blog,
      _id: blog._id.toString(),
      views: blog.views + 1, // Return updated view count
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update blog (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = params;
    const body = await request.json();
    const { title, content, category, tags, coverImage, published, excerpt, seoTitle, seoDescription } = body;

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingBlog.slug;
    if (title && title !== existingBlog.title) {
      const baseSlug = generateSlug(title);
      slug = baseSlug;
      let counter = 1;

      // Ensure unique slug (excluding current blog)
      while (await Blog.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Calculate read time if content changed
    const readTime = content ? calculateReadTime(content) : existingBlog.readTime;

    // Generate excerpt if not provided and content exists
    const finalExcerpt = excerpt || (content ? content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : existingBlog.excerpt);

    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug !== existingBlog.slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (finalExcerpt) updateData.excerpt = finalExcerpt;
    if (category) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (published !== undefined) {
      updateData.published = published;
      // Update publishedAt if publishing for the first time
      if (published && !existingBlog.published) {
        updateData.publishedAt = new Date();
      }
    }
    if (readTime) updateData.readTime = readTime;
    if (seoTitle) updateData.seoTitle = seoTitle;
    if (seoDescription) updateData.seoDescription = seoDescription;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Blog updated successfully',
      blog: {
        ...updatedBlog.toObject(),
        _id: updatedBlog._id.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete blog (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}