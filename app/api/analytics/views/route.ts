export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';

// GET /api/analytics/views - Get view analytics
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, all

    // Calculate date range
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { lastViewed: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { lastViewed: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { lastViewed: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {}; // All time
    }

    // Get total views
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Get most viewed posts
    const mostViewed = await Blog.find({ published: true })
      .sort({ views: -1 })
      .limit(10)
      .select('title slug views category')
      .lean();

    console.log('Analytics - Most viewed posts found:', mostViewed.length);
    console.log('Analytics - Sample post:', mostViewed[0]);

    // Get views by category
    const viewsByCategory = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', totalViews: { $sum: '$views' }, postCount: { $sum: 1 } } },
      { $sort: { totalViews: -1 } }
    ]);

    // Get recent activity (posts with recent views)
    const recentActivity = await Blog.find({
      published: true,
      lastViewed: { $exists: true },
      ...dateFilter
    })
    .sort({ lastViewed: -1 })
    .limit(20)
    .select('title slug views lastViewed category')
    .lean();

    return NextResponse.json({
      totalViews: totalViews[0]?.totalViews || 0,
      mostViewed: mostViewed.map((post: any) => ({
        ...post,
        _id: post._id.toString(),
      })),
      viewsByCategory,
      recentActivity: recentActivity.map((post: any) => ({
        ...post,
        _id: post._id.toString(),
      })),
      period,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}