import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/auth';
import { AuthenticatedRequest } from '@/lib/types/auth';

// GET /api/analytics - Get analytics data
async function getAnalytics(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const userId = request.user?.userId;
    const userRole = request.user?.role;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Build where clause based on user role
    const propertyWhere: any = {
      createdAt: {
        gte: startDate,
        lte: now,
      },
    };

    if (userRole === 'AGENT') {
      propertyWhere.agentId = userId;
    }
    // Admin sees all data, User sees limited data

    // Get overview metrics
    const [
      totalProperties,
      totalViews,
      totalInquiries,
      previousPeriodProperties,
      previousPeriodViews,
      previousPeriodInquiries,
    ] = await Promise.all([
      // Current period
      prisma.property.count({
        where: propertyWhere,
      }),
      prisma.propertyView.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
          ...(userRole === 'AGENT' && {
            property: { agentId: userId },
          }),
        },
      }),
      prisma.inquiry.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
          ...(userRole === 'AGENT' && { agentId: userId }),
        },
      }),
      // Previous period for comparison
      prisma.property.count({
        where: {
          ...propertyWhere,
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
        },
      }),
      prisma.propertyView.count({
        where: {
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
          ...(userRole === 'AGENT' && {
            property: { agentId: userId },
          }),
        },
      }),
      prisma.inquiry.count({
        where: {
          createdAt: {
            gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
            lt: startDate,
          },
          ...(userRole === 'AGENT' && { agentId: userId }),
        },
      }),
    ]);

    // Calculate trends
    const propertyTrend = previousPeriodProperties > 0 
      ? ((totalProperties - previousPeriodProperties) / previousPeriodProperties) * 100 
      : 0;
    const viewsTrend = previousPeriodViews > 0 
      ? ((totalViews - previousPeriodViews) / previousPeriodViews) * 100 
      : 0;
    const inquiriesTrend = previousPeriodInquiries > 0 
      ? ((totalInquiries - previousPeriodInquiries) / previousPeriodInquiries) * 100 
      : 0;

    // Get property performance data (monthly)
    const propertyPerformance = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', p.created_at), 'Mon') as month,
        COUNT(CASE WHEN p.type = 'SALE' THEN 1 END)::int as sales,
        COUNT(CASE WHEN p.type = 'RENT' THEN 1 END)::int as rentals,
        COALESCE(SUM(pv.view_count), 0)::int as views,
        COALESCE(SUM(i.inquiry_count), 0)::int as inquiries
      FROM properties p
      LEFT JOIN (
        SELECT property_id, COUNT(*) as view_count
        FROM property_views
        WHERE created_at >= ${startDate}
        GROUP BY property_id
      ) pv ON p.id = pv.property_id
      LEFT JOIN (
        SELECT property_id, COUNT(*) as inquiry_count
        FROM inquiries
        WHERE created_at >= ${startDate}
        GROUP BY property_id
      ) i ON p.id = i.property_id
      WHERE p.created_at >= ${startDate}
      ${userRole === 'AGENT' ? `AND p.agent_id = '${userId}'` : ''}
      GROUP BY DATE_TRUNC('month', p.created_at)
      ORDER BY DATE_TRUNC('month', p.created_at)
    `;

    // Get top performing properties
    const topProperties = await prisma.property.findMany({
      where: {
        ...(userRole === 'AGENT' && { agentId: userId }),
      },
      select: {
        id: true,
        title: true,
        price: true,
        type: true,
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
        _count: {
          select: {
            views: true,
            inquiries: true,
          },
        },
      },
      orderBy: {
        views: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Get location analytics
    const locationAnalytics = await prisma.$queryRaw`
      SELECT 
        city,
        state,
        COUNT(*)::int as properties,
        AVG(price)::int as average_price,
        COALESCE(SUM(view_count), 0)::int as total_views
      FROM properties p
      LEFT JOIN (
        SELECT property_id, COUNT(*) as view_count
        FROM property_views
        WHERE created_at >= ${startDate}
        GROUP BY property_id
      ) pv ON p.id = pv.property_id
      WHERE p.created_at >= ${startDate}
      ${userRole === 'AGENT' ? `AND p.agent_id = '${userId}'` : ''}
      GROUP BY city, state
      ORDER BY properties DESC
      LIMIT 10
    `;

    // Generate mock user engagement data (replace with real data when available)
    const userEngagement = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        activeUsers: Math.floor(Math.random() * 100) + 50,
        newUsers: Math.floor(Math.random() * 20) + 5,
        pageViews: Math.floor(Math.random() * 500) + 200,
      };
    });

    // Calculate conversion rate
    const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;

    // Get average property price
    const avgPriceResult = await prisma.property.aggregate({
      where: {
        ...(userRole === 'AGENT' && { agentId: userId }),
      },
      _avg: {
        price: true,
      },
    });

    const analytics = {
      overview: {
        totalProperties,
        totalViews,
        totalInquiries,
        totalRevenue: 0, // TODO: Implement revenue tracking
        conversionRate,
        averagePrice: avgPriceResult._avg.price || 0,
        trends: {
          properties: Math.round(propertyTrend * 100) / 100,
          views: Math.round(viewsTrend * 100) / 100,
          inquiries: Math.round(inquiriesTrend * 100) / 100,
          revenue: 0, // TODO: Implement revenue trend
        },
      },
      propertyPerformance: propertyPerformance || [],
      topProperties: topProperties.map(property => ({
        id: property.id,
        title: property.title,
        views: property._count.views,
        inquiries: property._count.inquiries,
        price: property.price,
        type: property.type,
        image: property.images[0]?.url,
      })),
      locationAnalytics: locationAnalytics || [],
      userEngagement,
    };

    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(getAnalytics);
