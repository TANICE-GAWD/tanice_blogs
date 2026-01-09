export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';

// GET /api/analytics/views - Get view analytics
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get total views
    const totalViewsResult = await Blog.aggregate([
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
      lastViewed: { $exists: true }
    })
    .sort({ lastViewed: -1 })
    .limit(20)
    .select('title slug views lastViewed category')
    .lean();

    const result = {
      totalViews: totalViewsResult[0]?.totalViews || 0,
      mostViewed: mostViewed.map((post: any) => ({
        ...post,
        _id: post._id.toString(),
      })),
      viewsByCategory,
      recentActivity: recentActivity.map((post: any) => ({
        ...post,
        _id: post._id.toString(),
      })),
    };

    console.log('Analytics result:', {
      totalViews: result.totalViews,
      mostViewedCount: result.mostViewed.length,
      categoriesCount: result.viewsByCategory.length,
      recentActivityCount: result.recentActivity.length
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}