import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';

// GET /api/analytics/summary - Get summary analytics for resume/portfolio
export async function GET() {
  try {
    await dbConnect();

    // Get basic counts
    const [totalPosts, publishedPosts] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ published: true })
    ]);

    // Get total views and most viewed post
    const [viewsResult, mostViewed] = await Promise.all([
      Blog.aggregate([
        { $match: { published: true } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]),
      Blog.findOne({ published: true })
        .sort({ views: -1 })
        .select('title views category')
        .lean()
    ]);

    const totalViews = viewsResult[0]?.totalViews || 0;

    // Get category distribution
    const categoryStats = await Blog.aggregate([
      { $match: { published: true } },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        } 
      },
      { $sort: { totalViews: -1 } }
    ]);

    // Calculate engagement metrics
    const postsWithViews = await Blog.countDocuments({ 
      published: true, 
      views: { $gt: 0 } 
    });

    const avgViewsPerPost = publishedPosts > 0 ? Math.round(totalViews / publishedPosts) : 0;
    const engagementRate = publishedPosts > 0 ? Math.round((postsWithViews / publishedPosts) * 100) : 0;

    // Get total reading time
    const readTimeResult = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: null, totalReadTime: { $sum: '$readTime' } } }
    ]);

    const totalReadTime = readTimeResult[0]?.totalReadTime || 0;

    return NextResponse.json({
      summary: {
        totalPosts,
        publishedPosts,
        totalViews,
        totalReadTime,
        avgViewsPerPost,
        engagementRate,
        postsWithViews
      },
      mostViewed: mostViewed ? {
        title: (mostViewed as any).title,
        views: (mostViewed as any).views || 0,
        category: (mostViewed as any).category
      } : null,
      categoryStats: categoryStats.map(stat => ({
        category: stat._id,
        postCount: stat.count,
        totalViews: stat.totalViews
      })),
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics summary' },
      { status: 500 }
    );
  }
}